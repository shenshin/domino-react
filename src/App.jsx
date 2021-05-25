import {
  User, AIPlayer, Playline, Stock, Header,
} from './components'
import { PageContainer } from './components/styled'

const App = () => (
  <>
    <Header />
    <PageContainer>
      <Stock />
      <AIPlayer />
      <Playline />
      <User />
    </PageContainer>
  </>
);

export default App
