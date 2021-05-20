import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Tile from './Tile'
import {
  restartGame,
  putTileToStock,
  drawTileToAI,
  drawTileToUser,
  drawTileToPlayline,
} from '../redux/dominoSlice'
import Container from './StockContainer'
import { dispatchConsequently } from '../util/tileOperations'

const Stock = () => {
  const dispatch = useDispatch()
  const tiles = useSelector((state) => state.domino.stock)

  useEffect(() => {
    (async () => {
      const delay = 0.3
      dispatch(restartGame());
      await dispatchConsequently(dispatch, {
        action: putTileToStock,
        steps: 28,
        delay,
      })
      await dispatchConsequently(dispatch, {
        action: drawTileToAI,
        steps: 6,
        delay,
      })
      await dispatchConsequently(dispatch, {
        action: drawTileToUser,
        steps: 6,
        delay,
      })
      dispatch(drawTileToPlayline())
    })()
  }, [dispatch])

  return (
    <div>
      <h5>Game Stock</h5>
      {tiles?.length > 0 ? (
        <Container>
          {tiles?.map((tile, i) => (
            <Tile
              key={tile.id}
              tile={tile}
              size="sm"
              color="textSecondary"
              stock
            />
          ))}
        </Container>
      ) : (
        <p>is empty</p>
      )}
    </div>
  )
}

export default Stock
