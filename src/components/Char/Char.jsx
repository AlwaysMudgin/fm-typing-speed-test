import React from 'react';
import styled from 'styled-components';

function Char({ status, children }) {
  if (status === 'current') {
    return <Current>{children}</Current>;
  }
  if (status === 'correct') {
    return <Correct>{children}</Correct>;
  }
  if (status === 'incorrect') {
    return <Incorrect>{children}</Incorrect>;
  }
  return <Base>{children}</Base>;
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

export default Char;
