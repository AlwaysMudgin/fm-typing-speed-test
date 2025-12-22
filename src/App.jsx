import styled from 'styled-components';
import './App.css';

import Header from './components/Header/Header';
import TestArea from './components/TestArea/TestArea';

function App() {
  return (
    <Wrapper>
      <Header />
      <TestArea />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: var(--neutral-900);
  max-width: 76rem;
`;

export default App;
