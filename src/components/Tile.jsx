import {
  useEffect, useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import {
  userMakesMove,
  aiMakesMove,
  setTileCoords,
  unsetUserTileCoords,
} from '../redux/dominoSlice'
import {
  startDrag, stopDrag, startDrop, stopDrop,
} from '../redux/dragNdropSlice'
import { getNumbers } from '../util/tileOperations'

const DominoTile = styled(motion.div)`
  margin: 1px;
  visibility: hidden;
  font-size: ${({ size }) => (size === 'sm' ? css`2rem` : size === 'md' ? css`3.5rem` : css`5rem`)};
  ${({ drag }) => drag
    && css`
      cursor: move;
    `}
  ${({ droppable }) => droppable
    && css`
      color: aquamarine;
    `}
`;

const Tile = ({
  tile = {
    id: '66',
    isRotated: false,
    lastCoords: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  },
  size = 'md',
  tileStyle = 'vertical',
  draggable = false,
  first = false,
  last = false,
  duration = 0.3,
  // in order styled components to work
  className,
}) => {
  const ref = useRef()
  const dispatch = useDispatch()
  const { draggedTile, droppedTile } = useSelector((state) => state.dragNdrop)
  const controls = useAnimation()

  // animate each tile after mount
  useEffect(() => {
    // show the tile since it was hidden before animatiom
    controls.set({
      visibility: 'visible',
    })
    // animate if previous position was set
    if (tile.lastCoords) {
      // read the current tile location to calculate translation x and y
      const coords = ref?.current?.getBoundingClientRect?.()
      // move the tile back to it's unmounting position
      controls.set({
        x: tile.lastCoords.x - coords?.x ?? 0,
        y: tile.lastCoords.y - coords?.y ?? 0,
      })
      // animate tile from previous to current location
      controls.start({
        x: 0,
        y: 0,
        transition: {
          duration,
        },
      }).then(() => {
        // if the tile is in the user's stock, disable future animations
        if (draggable) {
          dispatch(unsetUserTileCoords(tile))
        } else {
          // after animation save tile new position to start from on the next animation
          const rect = ref?.current?.getBoundingClientRect?.()
          if (rect) {
            const {
              x, y, width, height,
            } = rect
            dispatch(setTileCoords({
              tile,
              lastCoords: {
                x,
                y,
                width,
                height,
              },
            }))
          }
        }
      })
    }
  }, [])

  // drop observer
  useEffect(() => {
    if (isDroppable(droppedTile)) {
      // screen position of a droppable tile (in the playline)
      const tileCoords = ref.current.getBoundingClientRect()
      // center of a tile being dropped
      const dropCenterX = droppedTile.lastCoords.x + droppedTile.lastCoords.width / 2
      const dropCenterY = droppedTile.lastCoords.y + droppedTile.lastCoords.height / 2
      // conditions met when droppable and dropped tile are close to each other
      const tilesFitHorizontally = (dropCenterX >= tileCoords.x)
      && (dropCenterX <= (tileCoords.x + tileCoords.width))
      const tilesFitVertically = (dropCenterY >= tileCoords.y)
      && (dropCenterY <= (tileCoords.y + tileCoords.height))
      if (tilesFitHorizontally && tilesFitVertically) {
        dispatchMoves()
      }
    }
  }, [droppedTile])

  const dispatchMoves = () => {
    dispatch(userMakesMove({ tile: droppedTile, position: first }))
    dispatch(stopDrop())
    setTimeout(() => {
      dispatch(aiMakesMove())
    }, 600)
  }

  // calculates tile orientation
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
    dispatch(startDrag(tile))
  }
  // occurs on the draggable target when the user has finished dragging the element
  const handleDragEnd = () => {
    dispatch(stopDrag())
    const {
      x, y, width, height,
    } = ref.current.getBoundingClientRect()
    dispatch(startDrop({
      ...tile,
      lastCoords: {
        x,
        y,
        width,
        height,
      },
    }))
  }

  // filters appropriate tiles only
  const isDroppable = (movedTiled) => movedTiled && ((first
    && last
    && getNumbers(movedTiled).some((i) => getNumbers(tile).includes(i)))
    || (first && getNumbers(movedTiled).includes(getNumbers(tile)[0]))
    || (last && getNumbers(movedTiled).includes(getNumbers(tile)[1])))

  return (
    <DominoTile
      className={className}
      size={size}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: getHtml() }}
      droppable={isDroppable(draggedTile)}
      /* framer-motion props */
      animate={controls}
      drag={draggable}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  )
}

export default Tile
