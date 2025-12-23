import useLocalStorage from './hooks/useLocalStorage';
import styled from 'styled-components';
import './App.css';

import Header from './components/Header/Header';
import TestArea from './components/TestArea/TestArea';

function App() {
  const [personalBest, setPersonalBest] = useLocalStorage('personal-best', 0);
  console.log(personalBest);
  return (
    <Wrapper>
      <Header best={personalBest} />
      <TestArea best={personalBest} newBest={setPersonalBest} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: var(--neutral-900);
  max-width: 76rem;
`;

export default App;
