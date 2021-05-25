import styled from 'styled-components'

const Button = styled.button`
  padding: 3px 9px;
  margin: 0.5rem 0;
  width: fit-content;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.02rem;
  line-height: 1.75;
  color: ${(props) => props.theme.textPrimary};
  font-size: 0.8125rem;
  background-color: ${(props) => props.theme.background};
  border: 1px solid #4d4d4d;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
  &:active {
    background-color: #4c4c4c;
  }
`
export default Button
