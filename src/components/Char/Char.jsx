import { memo } from 'react';
import styled from 'styled-components';

function Char({ status, char }) {
  console.log('char re-render: ', char);
  if (status === 'current') {
    return <Current>{char}</Current>;
  }
  if (status === 'correct') {
    return <Correct>{char}</Correct>;
  }
  if (status === 'incorrect') {
    return <Incorrect>{char}</Incorrect>;
  }
  return <Base>{char}</Base>;
}

const Base = styled.span`
  background: none;
  color: var(--neutral-400);
`;

const Correct = styled(Base)`
  color: var(--green);
`;

const Incorrect = styled(Base)`
  color: var(--red);
  text-decoration: underline;
`;

const Current = styled(Base)`
  background-color: hsl(240deg, 1%, 59%, 0.3);
`;

export default memo(Char);
