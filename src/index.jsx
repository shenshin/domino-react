import { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import App from './App'
import store from './redux/store'
import theme from './theme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import GlobalStyles from './GlobalStyles'

render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
  document.getElementById('root'),
)
