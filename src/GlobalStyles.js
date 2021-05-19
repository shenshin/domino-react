import { createGlobalStyle } from 'styled-components'

const textPrimary = '#e6e6e6'
const textSecondary = '#b4b4b4'
const background = '#303030'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Roboto, fantasy;
    font-weight: 400;
  }
  html {
    height: 100%;
  }
  body {
    padding: 1rem;
    color: ${textSecondary};
    background-color: ${background};
    /* disable text selection */
    -ms-user-select:none;
    -moz-user-select:none;
    -webkit-user-select:none;
    -webkit-touch-callout: none;
    -khtml-user-select: none;
    user-select:none;
  }
  button {
    padding: 3px 9px;
    margin-bottom: 0.5rem;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 0.02rem;
    line-height: 1.75;
    color: ${textPrimary};
    font-size: 0.8125rem;
    background-color: ${background};
    border: 1px solid #4d4d4d;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background-color: #333;
    }
    &:active {
      background-color: #4c4c4c;
    }
  }
`
export default GlobalStyles
