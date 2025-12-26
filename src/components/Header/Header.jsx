import styled from 'styled-components';

import logoLg from '../../assets/images/logo-large.svg?url';
import logoSm from '../../assets/images/logo-small.svg?url';
import TrophyIcon from '../../assets/images/icon-personal-best.svg?react';
import { MOBILE_BREAKPOINT } from '../../constants';

function Header({ best }) {
  return (
    <Wrapper>
      <picture>
        <source srcSet={logoSm} media={`(max-width: ${MOBILE_BREAKPOINT})`} />
        <img src={logoLg} />
      </picture>
      <Right>
        <TrophyIcon /> <BestLabelDesktop>Personal Best: </BestLabelDesktop>
        <BestLabelMobile>Best: </BestLabelMobile>
        <Best>{best} WPM</Best>
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

const BestLabelDesktop = styled.span`
  display: inline;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const BestLabelMobile = styled.span`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: inline;
  }
`;

const Best = styled.span`
  color: white;
`;

export default Header;
