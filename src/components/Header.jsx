import styled from 'styled-components'

const GameHeader = styled.header`
  padding: 0.1rem 0.4rem;
  background-color: #18191b;
`
const PageTitle = styled.h1`
  color: #ccc;
  font-weight: 100;
  text-transform: uppercase;
  font-size: 1.6rem;
`

const Header = () => (
  <GameHeader>
    <PageTitle>
      Play&nbsp;Domino&nbsp;with&nbsp;A.I.
    </PageTitle>
  </GameHeader>
)

export default Header
