import { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { EXCEPTED_KEYS, TIMER_SECONDS } from '../../constants';
import {
  getAccuracyTotals,
  getTestArray,
  getWpm,
  formatTime,
} from '../../utils';

import restartIcon from '../../assets/images/icon-restart.svg';
import completedIcon from '../../assets/images/icon-completed.svg';
import newPersonalBestIcon from '../../assets/images/icon-new-pb.svg';

import Char from '../Char/Char';

function StatsAndOptions({
  wpm,
  accuracy,
  time,
  difficulty,
  mode,
  changeDifficulty,
  changeMode,
}) {
  return (
    <TopBar>
      <Info>
        <StatWrapper>
          <Label>WPM:</Label>
          <Stat>{wpm}</Stat>
        </StatWrapper>
        <Divider />
        <StatWrapper>
          <Label>Accuracy:</Label>
          <Stat>{accuracy}%</Stat>
        </StatWrapper>
        <Divider />
        <StatWrapper>
          <Label>Time:</Label>
          <Stat>{mode === 'passage' ? '-:--' : formatTime(time)}</Stat>
        </StatWrapper>
      </Info>
      <Info>
        <StatWrapper>
          <Label>Difficulty:</Label>
          <Stat>
            <Button
              onClick={() => changeDifficulty('easy')}
              $active={difficulty === 'easy'}
            >
              Easy
            </Button>
            <Button
              onClick={() => changeDifficulty('medium')}
              $active={difficulty === 'medium'}
            >
              Medium
            </Button>
            <Button
              onClick={() => changeDifficulty('hard')}
              $active={difficulty === 'hard'}
            >
              Hard
            </Button>
          </Stat>
        </StatWrapper>
        <Divider />
        <StatWrapper>
          <Label>Mode:</Label>
          <Stat>
            <Button
              onClick={() => changeMode('timed')}
              $active={mode === 'timed'}
            >
              Timed (60s)
            </Button>
            <Button
              onClick={() => changeMode('passage')}
              $active={mode === 'passage'}
            >
              Passage
            </Button>
          </Stat>
        </StatWrapper>
      </Info>
    </TopBar>
  );
}

function EndScreen({ wpm, accuracy, restart, best, newBest }) {
  const isBest = useMemo(() => wpm > best, []);
  // This feels hacky and the safety protocols hate it - is there a better
  // way to update the personal best state without destroying the conditional
  // end screen based on original value?

  if (isBest) {
    newBest(wpm);
  }

  return (
    <EndWrapper>
      {isBest ? (
        <CheckIcon src={newPersonalBestIcon} />
      ) : (
        <Circles>
          <CheckIcon src={completedIcon} />
        </Circles>
      )}

      <EndHeading>
        {isBest ? 'High Score Smashed!' : 'Test Complete!'}
      </EndHeading>
      <EndText>
        {isBest
          ? "You're getting faster. That was incredible typing."
          : 'Solid run. Keep pushing to beat your high score.'}
      </EndText>
      <EndStats>
        <EndStat>
          <Label>WPM:</Label>
          <Stat>{wpm}</Stat>
        </EndStat>
        <EndStat>
          <Label>Accuracy:</Label>
          <Stat>{accuracy.percentage}%</Stat>
        </EndStat>
        <EndStat>
          <Label>Characters:</Label>
          <Stat>
            <Correct>{accuracy.correct}</Correct>/
            <Incorrect>{accuracy.incorrect}</Incorrect>
          </Stat>
        </EndStat>
      </EndStats>
      <Again onClick={restart}>
        {isBest ? 'Beat This Score' : 'Go Again'} <Restart src={restartIcon} />
      </Again>
    </EndWrapper>
  );
}

function TestArea({ best, newBest }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [testArray, setTestArray] = useState(getTestArray('medium'));
  const [inputArray, setInputArray] = useState([]);
  const [mode, setMode] = useState('timed');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracyArray, setAccuracyArray] = useState([]);
  const [time, setTime] = useState(TIMER_SECONDS);
  const [numWords, setNumWords] = useState(0);
  const [testPhase, setTestPhase] = useState(0);

  const { correct, incorrect, percentage } = useMemo(
    () => getAccuracyTotals(accuracyArray),
    [accuracyArray]
  );
  const wpm = useMemo(() => getWpm(numWords, time), [numWords, time]);

  const handleKeyDown = useCallback(
    (event) => {
      if (testPhase !== 1) return;
      event.preventDefault();
      const key = event.key;
      if (EXCEPTED_KEYS.includes(key)) return;
      if (key === 'Backspace' && currentIndex === 0) return;
      if (key === 'Backspace') {
        setInputArray((previous) => [...previous.slice(0, -1)]);
        setCurrentIndex((previous) => previous - 1);
        return;
      }

      if (
        testArray[currentIndex] === ' ' &&
        currentIndex > accuracyArray.length - 1
      ) {
        setNumWords((previous) => previous + 1);
      }

      setInputArray((previous) => [...previous, key]);

      if (currentIndex > accuracyArray.length - 1) {
        setAccuracyArray((previous) => [
          ...previous,
          key === testArray[currentIndex],
        ]);
      }

      if (currentIndex === testArray.length - 1) {
        setTestPhase(2);
        setCurrentIndex(0);
        return;
      }
      setCurrentIndex((previous) => previous + 1);
    },
    [accuracyArray, testPhase, testArray, currentIndex]
  );

  useEffect(() => {
    let interval;

    function updateTime() {
      setTime((prev) => prev - 1);
      console.log('tick');
    }

    if (testPhase === 1 && mode === 'timed') {
      interval = setInterval(updateTime, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [testPhase, mode]);

  useEffect(() => {
    let timer;

    if (testPhase === 1 && mode === 'timed') {
      timer = setTimeout(() => {
        setTestPhase(2);
      }, TIMER_SECONDS * 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [testPhase, mode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  function getCharStatus(index) {
    if (index < currentIndex) {
      return inputArray[index] === testArray[index] ? 'correct' : 'incorrect';
    }
    if (index === currentIndex) return 'current';
    return;
  }

  function changeDifficulty(next) {
    if (next === difficulty) return;
    handleRestart();
    setDifficulty(next);
    setTestArray(getTestArray(next));
  }

  function changeMode(next) {
    if (next === mode) return;
    handleRestart();
    setMode(next);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAccuracyArray([]);
    setInputArray([]);
    setTime(TIMER_SECONDS);
    setNumWords(0);
    setTestPhase(0);
  }

  return (
    <Wrapper>
      <StatsAndOptions
        wpm={wpm}
        accuracy={percentage}
        time={time}
        difficulty={difficulty}
        mode={mode}
        changeDifficulty={changeDifficulty}
        changeMode={changeMode}
      />
      <Passage>
        {testArray.map((char, index) => {
          return <Char key={index} char={char} status={getCharStatus(index)} />;
        })}
        {testPhase === 0 && (
          <StartDialog onClick={() => setTestPhase(1)}>
            <StartButton>Start Typing Test</StartButton>
            <StartText>Or click the text and start typing</StartText>
          </StartDialog>
        )}
      </Passage>
      {testPhase === 1 && (
        <RestartWrapper>
          <RestartButton onClick={handleRestart}>
            Restart Test <Restart src={restartIcon} />
          </RestartButton>
        </RestartWrapper>
      )}
      {testPhase === 2 && (
        <EndScreen
          wpm={wpm}
          accuracy={{ correct, incorrect, percentage }}
          restart={handleRestart}
          best={best}
          newBest={newBest}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.main`
  position: relative;
`;

const TopBar = styled.div`
  display: flex;
  color: var(--neutral-400);
  justify-content: space-between;
  padding: 1rem 0;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const Label = styled.p`
  color: var(--neutral-400);
`;

const Stat = styled.p`
  display: flex;
  gap: 6px;
  color: white;
  font-weight: bold;
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: var(--neutral-800);
`;

const Button = styled.button`
  background: none;
  color: ${(props) => (props.$active ? 'var(--blue-400)' : 'white')};
  font-weight: bold;
  border: 1px solid var(--neutral-500);
  border-radius: 8px;

  border-color: ${(props) =>
    props.$active ? 'var(--blue-400)' : 'var(--neutral-500)'};

  &:hover {
    cursor: pointer;
  }
`;

const Passage = styled.div`
  position: relative;
  font-size: 2.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--neutral-800);
  border-top: 1px solid var(--neutral-800);
`;

const StartDialog = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  background: transparent;
  backdrop-filter: blur(7px);
  border: none;
  font-size: 1.25rem;

  &:hover {
    cursor: pointer;
  }
`;

const StartButton = styled(Button)`
  background-color: var(--blue-600);
  color: white;
  border: none;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
`;

const StartText = styled.p`
  color: white;
`;

const RestartWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const RestartButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--neutral-800);
  border: none;
  padding: 0.25rem 0.5rem;
`;

const Restart = styled.img`
  display: inline-flex;
  align-items: center;
`;

const EndWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--neutral-900);
`;

const Circles = styled.div`
  --dimensions: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--dimensions);
  height: var(--dimensions);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    hsla(140deg, 63%, 57%, 0.4) 25%,
    hsla(140deg, 63%, 57%, 0.4) 55%,
    hsla(140deg, 63%, 57%, 0.2) 55%,
    hsla(140deg, 63%, 57%, 0.2) 100%
  );
`;

const CheckIcon = styled.img`
  --dimensions: 4rem;
  width: var(--dimensions);
  height: var(--dimensions);
`;

const EndHeading = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 0.4px;
  line-height: 1.36;
`;

const EndText = styled.p`
  color: var(--neutral-400);
  margin-bottom: 1rem;
`;

const EndStats = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1rem;
`;

const EndStat = styled.div`
  border: 1px solid var(--neutral-500);
  flex-grow: 1;
  padding: 1rem 1.5rem;
  border-radius: 8px;
`;

const Correct = styled.span`
  color: var(--green);
`;

const Incorrect = styled.span`
  color: var(--red);
`;

const Again = styled(RestartButton)`
  color: var(--neutral-900);
  background-color: white;
`;

export default TestArea;
