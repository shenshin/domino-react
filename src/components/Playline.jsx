import { useSelector } from 'react-redux'
import Tile from './Tile'
import Container from './StockContainer'

const PlayLine = () => {
  const playline = useSelector((state) => state.domino.playline)
  return (
    <div>
      <h5>Play Line</h5>
      <Container>
        {playline?.map((tile, i, a) => (
          <Tile
            tile={tile}
            key={tile.id}
            tileStyle="mixed"
            first={i === 0}
            last={i === a.length - 1}
          />
        ))}
      </Container>
    </div>
  )
}

export default PlayLine
