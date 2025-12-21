import React from 'react';
import styled from 'styled-components';

import logoLg from '../../assets/images/logo-large.svg';
// import logoSm from '../../assets/images/logo-small.svg';
import pbIcon from '../../assets/images/icon-personal-best.svg';

function Header() {
  return (
    <Wrapper>
      <Left src={logoLg} />
      <Right>
        <Trophy src={pbIcon} /> Personal Best: <Best>100 WPM</Best>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0;
`;

const Left = styled.img``;

const Right = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-400);
`;

const Trophy = styled.img``;

const Best = styled.span`
  color: white;
`;

export default Header;
