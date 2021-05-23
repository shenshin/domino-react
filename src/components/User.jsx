import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import Tile from './Tile'
import {
  drawTileToUser,
  drawTileToAI,
  userMissesMove,
  aiMakesMove,
  restartGame,
} from '../redux/dominoSlice'
import StockContainer from './StockContainer'

const Button = styled.button`
  margin-top: 0.5rem;
`
const Title = styled.p`
  text-transform: uppercase;
  font-size: 1rem;
`
const SubTitle = styled.p`
  font-size: 1rem;
  ${({ lose }) => (lose
    ? css`color: red;`
    : css`color: aquamarine;`)}
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
    <div>
      <Title>Your Stock</Title>
      {!winner && (
      <SubTitle>
        Drop a tile and drag it to the Play Line
      </SubTitle>
      )}
      {/* {winner && <h4>{`Game over! The winner today is ${winner?.name}`}</h4>} */}
      <StockContainer>
        {user?.stock?.map((tile) => (
          <Tile key={tile.id} tile={tile} draggable={!winner} />
        ))}
      </StockContainer>
      {winner && (winner?.id === 1 ? (
        <SubTitle>
          You Won! Great Victory! Restart to play again
        </SubTitle>
      ) : (
        <SubTitle lose>
          You Lose. Restart to try again.
        </SubTitle>
      ))}
      <Button
        onClick={winner ? handleRestart : stock?.length > 0 ? handleDrawTile : handleMissMove}
      >
        {winner ? 'Restart the Game' : stock?.length > 0 ? 'Draw a tile from the game stock' : 'Miss Move'}
      </Button>
    </div>
  )
}

export default User
