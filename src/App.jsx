import { useState, useCallback, useEffect } from 'react';
import { getTestArray, getAccuracyTotals, getWpm, formatTime } from './utils';
import { EXCEPTED_KEYS } from './constants';
import styled from 'styled-components';
import './App.css';

import restart from './assets/images/icon-restart.svg';

import Header from './components/Header/Header';
import Char from './components/Char/Char';

function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [testArray, setTestArray] = useState(getTestArray('medium'));
  const [mode, setMode] = useState('timed');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracyArray, setAccuracyArray] = useState([]);
  const [time, setTime] = useState(60);
  const [numWords, setNumWords] = useState(0);
  const [testPhase, setTestPhase] = useState(0);

  const accuracy = getAccuracyTotals(accuracyArray).percentage;

  const handleKeyDown = useCallback(
    (event) => {
      if (testPhase !== 1) return;
      event.preventDefault();
      const key = event.key;
      if (EXCEPTED_KEYS.includes(key)) return;
      if (testArray[currentIndex] === ' ') {
        setNumWords((previous) => previous + 1);
      }
      setAccuracyArray((previous) => [
        ...previous,
        key === testArray[currentIndex],
      ]);
      if (currentIndex === testArray.length - 1) {
        setTestPhase(2);
        setCurrentIndex(null);
        return;
      }
      setCurrentIndex((previous) => previous + 1);
    },
    [testPhase, testArray, currentIndex]
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
      }, 60000);
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
      return accuracyArray[index] ? 'correct' : 'incorrect';
    }
    if (index === currentIndex) return 'current';
    return;
  }

  function handleDifficultyChange(next) {
    if (next === difficulty) return;
    handleRestart();
    setDifficulty(next);
    setTestArray(getTestArray(next));
  }

  function handleModeChange(next) {
    if (next === mode) return;
    handleRestart();
    setMode(next);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAccuracyArray([]);
    setTime(60);
    setNumWords(0);
    setTestPhase(0);
  }

  return (
    <Wrapper>
      <Header />
      <TopBar>
        <Info>
          <StatWrapper>
            <Label>WPM:</Label>
            <Stat>{getWpm(numWords, time)}</Stat>
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
                onClick={() => handleDifficultyChange('easy')}
                $active={difficulty === 'easy'}
              >
                Easy
              </Button>
              <Button
                onClick={() => handleDifficultyChange('medium')}
                $active={difficulty === 'medium'}
              >
                Medium
              </Button>
              <Button
                onClick={() => handleDifficultyChange('hard')}
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
                onClick={() => handleModeChange('timed')}
                $active={mode === 'timed'}
              >
                Timed (60s)
              </Button>
              <Button
                onClick={() => handleModeChange('passage')}
                $active={mode === 'passage'}
              >
                Passage
              </Button>
            </Stat>
          </StatWrapper>
        </Info>
      </TopBar>
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
            Restart Test <Restart src={restart} />
          </RestartButton>
        </RestartWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: var(--neutral-900);
  max-width: 76rem;
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

const Label = styled.p``;

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

export default App;
