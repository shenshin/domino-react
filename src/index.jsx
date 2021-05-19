import { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import App from './App'
import store from './redux/store'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import GlobalStyles from './GlobalStyles'

render(
  <StrictMode>
    <ReduxProvider store={store}>
      <GlobalStyles />
      <App />
    </ReduxProvider>
  </StrictMode>,
  document.getElementById('root'),
)
