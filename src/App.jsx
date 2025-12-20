import { useState, useCallback, useEffect } from 'react';
import { getTestArray } from './utils';
import { EXCEPTED_KEYS } from './constants';
import styled from 'styled-components';
import './App.css';

import Char from './components/Char/Char';

function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [testArray, setTestArray] = useState(getTestArray('medium'));
  const [mode, setMode] = useState('passage');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracyArray, setAccuracyArray] = useState([]);

  const currentChar = testArray[currentIndex];

  const handleKeyDown = useCallback(
    (event) => {
      event.preventDefault();
      const key = event.key;
      console.log('keydown fired: ', key);
      if (EXCEPTED_KEYS.includes(key)) return;
      console.log('current char: ', currentChar);
      setAccuracyArray((previous) => [...previous, key === currentChar]);
      setCurrentIndex((previous) => previous + 1);
    },
    [currentChar]
  );

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

  return (
    <Wrapper>
      {testArray.map((char, index) => {
        return (
          <Char key={index} status={getCharStatus(index)}>
            {char}
          </Char>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: var(--neutral-900);
`;

export default App;
