import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  userMakesMove,
  aiMakesMove,
  setGameStockCoords,
  setPlayerStockCoords,
} from '../redux/dominoSlice';
import { startDrag, stopDrag } from '../redux/dragNdropSlice';
import { getNumbers } from '../util/tileOperations';

const DominoTile = styled.span`
  font-size: ${({ size }) =>
    size === 'sm' ? css`2rem` : size === 'md' ? css`3.5rem` : css`5rem`};
  ${({ draggable }) =>
    draggable &&
    css`
      cursor: move;
    `}
  ${({ droppable }) =>
    droppable &&
    css`
      color: lightgreen;
    `}
`;

const Tile = ({
  tile,
  size = 'md',
  tileStyle = 'vertical',
  draggable,
  first,
  last,
  stock,
}) => {
  const dispatch = useDispatch();
  const { draggedTile } = useSelector((state) => state.dragNdrop);
  const { winner } = useSelector((state) => state.domino);
  const [rect, setRect] = useState(null);
  const spanRef = useCallback((node) => {
    if (node) {
      setRect(node.getBoundingClientRect());
    }
  }, []);

  // save tile coords to use in animations
  useEffect(() => {
    if (rect) {
      const { x, y, left, right, width, height, top, bottom } = rect;
      // tile is at the stock
      if (stock) {
        dispatch(
          setGameStockCoords({
            tile,
            location: {
              x,
              y,
              left,
              right,
              top,
              bottom,
              width,
              height,
            },
          }),
        );
        // tile is either at player or at playline
      } else {
        dispatch(
          setPlayerStockCoords({
            tile,
            location: {
              x,
              y,
              left,
              right,
              top,
              bottom,
              width,
              height,
            },
          }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect]);

  // gets html entity of the current tile
  const getHtml = () =>
    `&#${
      (tileStyle === 'horizontal'
        ? 127025
        : tileStyle === 'vertical'
        ? 127075
        : getNumbers(tile)[0] === getNumbers(tile)[1]
        ? 127075
        : 127025) + parseInt(getNumbers(tile).join(''), 7)
    };`;

  // occurs on the draggable target when the user starts to drag an element
  const handleDragStart = () => {
    dispatch(startDrag({ tile }));
  };
  // occurs on the draggable target when the user has finished dragging the element
  const handleDragEnd = () => {
    dispatch(stopDrag());
  };

  // occurs on the drop target when the dragged element is over the drop target
  const handleDrop = () => {
    dispatch(userMakesMove({ tile: draggedTile, position: first }));
    dispatch(stopDrag());
    if (!winner) {
      setTimeout(() => {
        dispatch(aiMakesMove());
      }, 1000);
    }
  };

  // filters appropriate tiles only
  const isDroppable = () =>
    draggedTile &&
    ((first &&
      last &&
      getNumbers(draggedTile).some((i) => getNumbers(tile).includes(i))) ||
      (first && getNumbers(draggedTile).includes(getNumbers(tile)[0])) ||
      (last && getNumbers(draggedTile).includes(getNumbers(tile)[1])));

  // occurs on the drop target when the dragged element is over the drop target
  const handleDragOver = (e) => {
    if (isDroppable()) {
      e.preventDefault();
    }
  };

  return (
    <DominoTile
      size={size}
      ref={spanRef}
      dangerouslySetInnerHTML={{ __html: getHtml() }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      draggable={draggable}
      droppable={isDroppable()}
    />
  );
};

export default Tile;
