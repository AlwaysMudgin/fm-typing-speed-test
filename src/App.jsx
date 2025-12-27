import useLocalStorage from './hooks/useLocalStorage';
import styled from 'styled-components';
import './App.css';
import { MOBILE_BREAKPOINT } from './constants';

import Header from './components/Header/Header';
import TestArea from './components/TestArea/TestArea';

function App() {
  const [personalBest, setPersonalBest] = useLocalStorage('personal-best', 0);

  return (
    <Wrapper>
      <Header best={personalBest} />
      <TestArea best={personalBest} newBest={setPersonalBest} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: var(--neutral-900);
  min-width: 100%;
  max-width: 76rem;
  padding: 0 2rem;
  height: 100%;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 0 1rem;
  }
`;

export default App;
