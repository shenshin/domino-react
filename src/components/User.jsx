import { useSelector, useDispatch } from 'react-redux'
import Tile from './Tile'
import {
  drawTileToUser,
  drawTileToAI,
  userMissesMove,
  aiMakesMove,
} from '../redux/dominoSlice'
// import styled from 'styled-components';
import StockContainer from './StockContainer'

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
  const handleMissMove = async () => {
    dispatch(userMissesMove())
    dispatch(aiMakesMove())
    setTimeout(() => {
      dispatch(drawTileToAI())
    }, 300)
  }
  return (
    <div>
      <h5>Your Stock</h5>
      <div>
        <button
          disabled={stock?.length === 0 || Boolean(winner)}
          onClick={handleDrawTile}
        >
          Draw Tile
        </button>
        <button disabled={Boolean(winner)} onClick={handleMissMove}>
          Miss Move
        </button>
      </div>
      <p>Drop a tile and drag it to the Playline</p>
      <StockContainer>
        {user?.stock?.map((tile) => (
          <Tile key={tile.id} tile={tile} draggable={!winner} />
        ))}
      </StockContainer>
    </div>
  )
}

export default User
