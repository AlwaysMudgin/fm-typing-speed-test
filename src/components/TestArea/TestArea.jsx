import { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

import {
  EXCEPTED_KEYS,
  TIMER_SECONDS,
  MOBILE_BREAKPOINT,
} from '../../constants';

import {
  getAccuracyTotals,
  getTestArray,
  getWpm,
  formatTime,
} from '../../utils';

import RestartIcon from '../../assets/images/icon-restart.svg?react';
import CompletedIcon from '../../assets/images/icon-completed.svg?react';
import NewPersonalBestIcon from '../../assets/images/icon-new-pb.svg?react';
import Confetti from '../../assets/images/pattern-confetti.svg?react';
import DownArrow from '../../assets/images/icon-down-arrow.svg?react';

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
          <Stat>{formatTime(time)}</Stat>
        </StatWrapper>
      </Info>
      <Options>
        <OptionButtons>
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
          <Divider />
          <Label>Mode:</Label>
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
        </OptionButtons>
        {/* Mobile */}
        <OptionSelect
          name="difficulty"
          value={difficulty}
          onChange={(e) => changeDifficulty(e.target.value)}
        >
          <button>
            <selectedcontent></selectedcontent>
            <DownArrow />
          </button>
          <Option value="easy">Easy</Option>
          <Option value="medium">Medium</Option>
          <Option value="hard">Hard</Option>
        </OptionSelect>
        <OptionSelect name="mode">
          <button>
            <selectedcontent></selectedcontent>
            <DownArrow />
          </button>
          <Option value="timed">Timed (60s)</Option>
          <Option value="passage">Passage</Option>
        </OptionSelect>
      </Options>
    </TopBar>
  );
}

const OptionSelect = styled.select`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    &,
    &::picker(select) {
      appearance: base-select;
    }

    &::picker-icon {
      display: none;
    }

    &::picker(select) {
      border-radius: 8px;
      background-color: var(--neutral-800);
      color: white;
      border: none;
      margin-top: 8px;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 50%;
    color: white;
    border-color: var(--neutral-500);
  }
`;

const Option = styled.option`
  padding: 6px;
  border: 1px solid transparent;

  &::checkmark {
    display: none;
  }

  &:checked {
    color: var(--blue-600);
  }
`;

function EndScreen({ wpm, accuracy, restart, best, newBest }) {
  // This feels hacky, but it's the only way I could figure to
  // update the personal best without re-rendering a non-best
  // end screen
  const isBest = useMemo(() => wpm > best, []);
  const currentBest = useMemo(() => best, []);

  if (isBest) {
    newBest(wpm);
  }

  return (
    <>
      <EndWrapper>
        {isBest && currentBest > 0 ? (
          <IconWrapper>
            <NewPersonalBestIcon />
          </IconWrapper>
        ) : (
          <Circles>
            <CompletedIcon />
          </Circles>
        )}

        <EndHeading>
          {isBest
            ? currentBest === 0
              ? 'Baseline Established!'
              : 'High Score Smashed!'
            : 'Test Complete!'}
        </EndHeading>
        <EndText>
          {isBest && currentBest > 0
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
          {isBest ? 'Beat This Score' : 'Go Again'} <RestartIcon />
        </Again>
      </EndWrapper>
      {isBest && (
        <ConfettiWrapper>
          <Confetti />
        </ConfettiWrapper>
      )}
    </>
  );
}

const EndWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--neutral-900);
`;

const IconWrapper = styled.div`
  --dimensions: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: var(--dimensions);
  height: var(--dimensions);
  border-radius: 50%;
`;

const Circles = styled(IconWrapper)`
  background: radial-gradient(
    circle,
    hsla(140deg, 63%, 57%, 0.4) 25%,
    hsla(140deg, 63%, 57%, 0.4) 55%,
    hsla(140deg, 63%, 57%, 0.2) 55%,
    hsla(140deg, 63%, 57%, 0.2) 100%
  );
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
  margin: 1rem 0;
`;

const EndStat = styled.div`
  border: 1px solid var(--neutral-500);
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 8px;
`;

const Correct = styled.span`
  color: var(--green);
`;

const Incorrect = styled.span`
  color: var(--red);
`;

const Button = styled.button`
  background: none;
  color: ${(props) => (props.$active ? 'var(--blue-400)' : 'white')};
  font-weight: bold;
  border: 1px solid var(--neutral-500);
  border-radius: 8px;
  width: max-content;

  border-color: ${(props) =>
    props.$active ? 'var(--blue-400)' : 'var(--neutral-500)'};

  &:hover {
    cursor: pointer;
    color: var(--blue-400);
    border-color: var(--blue-400);
  }
`;

const RestartButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--neutral-800);
  border: none;
  padding: 0.25rem 0.5rem;
`;

const Again = styled(RestartButton)`
  color: var(--neutral-900);
  background-color: white;
  margin-top: 1rem;
`;

const pop = keyframes`
    from {
      transform: translateY(100%) scale(1, 0);
    }
    to {
      transform: translateY(0) scale(1, 1);
    }
`;

const ConfettiWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  animation: ${pop} 1s forwards;
`;

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
  const wpm = useMemo(
    () => getWpm(numWords, time, mode),
    [numWords, time, mode]
  );

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

    function timeDown() {
      setTime((prev) => prev - 1);
      console.log('tick down');
    }

    function timeUp() {
      setTime((prev) => prev + 1);
      console.log('tick up');
    }

    if (testPhase === 1) {
      if (mode === 'timed') {
        interval = setInterval(timeDown, 1000);
      }
      if (mode === 'passage') {
        interval = setInterval(timeUp, 1000);
      }
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
    if (next === 'timed') {
      setTime(TIMER_SECONDS);
    } else {
      setTime(0);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAccuracyArray([]);
    setInputArray([]);
    setNumWords(0);
    setTestPhase(0);
  }

  if (testPhase !== 2)
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
            return (
              <Char key={index} char={char} status={getCharStatus(index)} />
            );
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
              Restart Test <RestartIcon />
            </RestartButton>
          </RestartWrapper>
        )}
      </Wrapper>
    );

  return (
    <Wrapper>
      <EndScreen
        wpm={wpm}
        accuracy={{ correct, incorrect, percentage }}
        restart={handleRestart}
        best={best}
        newBest={newBest}
      />
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
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Options = styled(Info)`
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex: 1;
  }
`;

const StatWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  font-size: 1.5rem;
`;

const Label = styled.p`
  color: var(--neutral-400);
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: bold;
`;

const OptionButtons = styled(Stat)`
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: var(--neutral-500);
  margin: 0 8px;
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

  &:hover {
    background-color: var(--blue-400);
    color: white;
  }
`;

const StartText = styled.p`
  color: white;
`;

const RestartWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export default TestArea;
