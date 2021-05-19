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

const dispatchConsequently = ({
  dispatch, action, steps, delay,
}) => {
  let count = 0
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (count < steps) {
        count += 1
        dispatch(action())
      } else {
        clearInterval(interval)
        resolve()
      }
    }, delay)
  })
}

const Stock = () => {
  const dispatch = useDispatch()
  const tiles = useSelector((state) => state.domino.stock)

  useEffect(() => {
    (async () => {
      dispatch(restartGame());
      await dispatchConsequently({
        dispatch,
        action: putTileToStock,
        steps: 28,
        delay: 300,
      })
      await dispatchConsequently({
        dispatch,
        action: drawTileToAI,
        steps: 6,
        delay: 1300,
      })
      await dispatchConsequently({
        dispatch,
        action: drawTileToUser,
        steps: 6,
        delay: 1300,
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
