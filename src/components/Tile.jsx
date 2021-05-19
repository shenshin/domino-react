import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import {
  userMakesMove,
  aiMakesMove,
  setGameStockCoords,
} from '../redux/dominoSlice'
import { startDrag, stopDrag } from '../redux/dragNdropSlice'
import { getNumbers } from '../util/tileOperations'

const DominoTile = styled(motion.div)`
  margin: 2px;
  line-height: ${({ isHorizontal }) => (isHorizontal ? css`0.5` : css`0.9`)};
  font-size: ${({ size }) => (size === 'sm' ? css`2rem` : size === 'md' ? css`3.5rem` : css`5rem`)};
  ${({ draggable }) => draggable
    && css`
      cursor: move;
    `}
  ${({ droppable }) => droppable
    && css`
      color: lightgreen;
    `}
  ${({ isVisible }) => !isVisible && css`visibility: hidden`};
`;

const Tile = ({
  tile = {
    id: '66',
    isRotated: false,
    location: {},
  },
  size = 'md',
  tileStyle = 'vertical',
  draggable = false,
  first = false,
  last = false,
  stock = false,
  // in order styled components to work
  className,
}) => {
  const controls = useAnimation()

  const dispatch = useDispatch()
  const { draggedTile } = useSelector((state) => state.dragNdrop)
  const { winner } = useSelector((state) => state.domino)
  const [coords, setCoords] = useState(null)
  const ref = useCallback((node) => {
    if (node) {
      setCoords(node.getBoundingClientRect())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // launch animation
  useEffect(() => {
    if (coords) {
      controls.set({
        visibility: 'visible',
        x: tile.lastCoords.x - coords.x,
        y: tile.lastCoords.y - coords.y,
        width: 0,
        height: 0,
      })
      controls.start({
        x: 0,
        y: 0,
        width: coords.width,
        height: coords.height,
        transition: {
          duration: 1,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords])

  // save tile coords to use in animations
  useEffect(() => {
    if (coords) {
      const {
        x, y, width, height,
      } = coords
      // tile is at the stock
      if (stock) {
        dispatch(setGameStockCoords({
          tile,
          lastCoords: {
            x, y, width, height,
          },
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.x, coords?.y])

  const isHorizontal = () => {
    switch (tileStyle) {
      case 'horizontal':
        return true
      case 'vertical':
        return false
      default:
        return getNumbers(tile)[0] !== getNumbers(tile)[1]
    }
  }

  // gets html entity of the current tile
  const getHtml = () => `&#${(isHorizontal() ? 127025 : 127075) + parseInt(getNumbers(tile).join(''), 7)};`

  // occurs on the draggable target when the user starts to drag an element
  const handleDragStart = () => {
    dispatch(startDrag({ tile }))
  }
  // occurs on the draggable target when the user has finished dragging the element
  const handleDragEnd = () => {
    dispatch(stopDrag())
  }

  // occurs on the drop target when the dragged element is over the drop target
  const handleDrop = () => {
    dispatch(userMakesMove({ tile: draggedTile, position: first }))
    dispatch(stopDrag())
    if (!winner) {
      setTimeout(() => {
        dispatch(aiMakesMove())
      }, 1000)
    }
  }

  // filters appropriate tiles only
  const isDroppable = () => draggedTile
    && ((first
      && last
      && getNumbers(draggedTile).some((i) => getNumbers(tile).includes(i)))
      || (first && getNumbers(draggedTile).includes(getNumbers(tile)[0]))
      || (last && getNumbers(draggedTile).includes(getNumbers(tile)[1])))

  // occurs on the drop target when the dragged element is over the drop target
  const handleDragOver = (e) => {
    if (isDroppable()) {
      e.preventDefault()
    }
  };

  return (
    <DominoTile
      animate={controls}
      className={className}
      size={size}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: getHtml() }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      draggable={draggable}
      droppable={isDroppable()}
      isHorizontal={isHorizontal()}
      isVisible={stock}
    />
  )
}

export default Tile
