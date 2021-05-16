import Tile from './Tile';
import { useSelector, useDispatch } from 'react-redux';
import {
  userDrawsTile,
  userMissesMove,
  aiMakesMove,
} from '../redux/dominoSlice';

const User = () => {
  const {
    players: [user],
    stock,
    winner,
  } = useSelector((state) => state.domino);
  const dispatch = useDispatch();
  const handleDrawTile = () => {
    dispatch(userDrawsTile());
  };
  const handleMissMove = () => {
    dispatch(userMissesMove());
    dispatch(aiMakesMove());
  };
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
      <div>
        {user?.stock?.map((tile) => (
          <Tile key={tile.id} tile={tile} draggable={!winner} />
        ))}
      </div>
    </div>
  );
};

export default User;
