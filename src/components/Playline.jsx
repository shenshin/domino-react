import Tile from './Tile';
import { useSelector } from 'react-redux';

const PlayLine = () => {
  const playline = useSelector((state) => state.domino.playline);
  return (
    <div>
      <h5>Play Line</h5>
      <div>
        {playline?.map((tile, i, a) => (
          <Tile
            tile={tile}
            key={tile.id}
            tileStyle="mixed"
            first={i === 0}
            last={i === a.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayLine;
