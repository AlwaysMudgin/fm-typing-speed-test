import styled from 'styled-components';

import DownIcon from '../../assets/images/icon-down-arrow.svg?react';

function Dropdown({ type, value, change }) {
  if (type === 'difficulty') {
    return <Select></Select>;
  }
}

const Select = styled.select`
  appearance: base-select;

  &::picker(select) {
    appearance: base-select;
  }
`;

export default Dropdown;
