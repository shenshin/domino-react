import { useEffect } from 'react';
import Tile from './Tile';
import { useSelector, useDispatch } from 'react-redux';
import { drawTileToAI, aiMakesMove } from '../redux/dominoSlice';

const AIPlayer = () => {
  const dispatch = useDispatch();
  const {
    players: [, aiPlayer],
  } = useSelector((state) => state.domino);
  // untill aiPlayer.missedLastMove is not 0, every 'delay'
  const delay = 600; // ms
  // milliseconds dispatch draw tile
  useEffect(() => {
    if (aiPlayer?.missedLastMove > 0) {
      setTimeout(() => {
        dispatch(drawTileToAI());
        dispatch(aiMakesMove());
      }, delay);
    }
  }, [aiPlayer?.missedLastMove, dispatch]);
  return (
    <div>
      {aiPlayer?.stock?.length > 0 ? (
        <div>
          <h6>Artificial Intelligence</h6>
          {aiPlayer?.missedLastMove > 0 && (
            <p>{`missed move ${aiPlayer?.missedLastMove}`}</p>
          )}
          <div>
            {aiPlayer?.stock?.map((tile) => (
              <Tile key={tile.id} tile={tile} />
            ))}
          </div>
        </div>
      ) : (
        <p>AI&apos;s stock is empty</p>
      )}
    </div>
  );
};

export default AIPlayer;
