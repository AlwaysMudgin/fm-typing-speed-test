import React from 'react';
import styled from 'styled-components';

import LogoLg from '../../assets/images/logo-large.svg?react';
// import logoSm from '../../assets/images/logo-small.svg';
import TrophyIcon from '../../assets/images/icon-personal-best.svg?react';

function Header({ best }) {
  return (
    <Wrapper>
      <LogoLg />
      <Right>
        <TrophyIcon /> Personal Best: <Best>{best} WPM</Best>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--neutral-400);
`;

const Best = styled.span`
  color: white;
`;

export default Header;
