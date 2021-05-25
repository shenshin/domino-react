import { createGlobalStyle } from 'styled-components'

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
    font-size: 20px;
  }
  body {
    color: ${(props) => props.theme.textSecondary};
    background-color: ${(props) => props.theme.background};
    /* disable text selection */
    -ms-user-select:none;
    -moz-user-select:none;
    -webkit-user-select:none;
    -webkit-touch-callout: none;
    -khtml-user-select: none;
    user-select:none;
  }
`
export default GlobalStyles
