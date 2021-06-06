import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Tile from './Tile'
import {
  drawTileToUser,
  drawTileToAI,
  userMissesMove,
  aiMakesMove,
  restartGame,
} from '../redux/dominoSlice'
import {
  StockContainer,
  Title,
  SubTitle,
  Button,
} from './styled'

const Message = styled(SubTitle)`
  font-weight: 200;
  font-size: 0.9rem;
  color: aquamarine;
`
const WinMessage = styled(Message)`
  font-size: 1.3rem;
`
const LoseMessage = styled(WinMessage)`
  color: red;
`

const User = () => {
  const {
    players: [user],
    stock,
    winner,
  } = useSelector((state) => state.domino)
  const dispatch = useDispatch()
  const handleDrawTile = () => {
    dispatch(drawTileToUser())
  }
  const handleMissMove = () => {
    dispatch(userMissesMove())
    dispatch(aiMakesMove())
    setTimeout(() => {
      dispatch(drawTileToAI())
    }, 300)
  }
  const handleRestart = () => {
    dispatch(restartGame())
  }
  return (
    <>
      <Title>{`Player: ${user?.name}`}</Title>
      {!user?.stock?.length && (
        <SubTitle>is empty</SubTitle>
      )}
      {!winner && (
      <Message>
        Drag a tile and drop it to the Play Line
      </Message>
      )}
      <StockContainer>
        {user?.stock?.map((tile) => (
          <Tile key={tile.id} tile={tile} draggable={!winner} />
        ))}
      </StockContainer>
      {winner && (winner?.id === 1 ? (
        <WinMessage>
          You Won! Great Victory! Restart to play again
        </WinMessage>
      ) : (
        <LoseMessage>
          You Lose. Restart to try again.
        </LoseMessage>
      ))}
      <Button
        onClick={winner ? handleRestart : stock?.length > 0 ? handleDrawTile : handleMissMove}
      >
        {winner ? 'Restart Game' : stock?.length > 0 ? 'Draw Tile' : 'Miss Move'}
      </Button>
    </>
  )
}

export default User
