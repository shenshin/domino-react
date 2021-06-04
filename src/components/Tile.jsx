import {
  useEffect, useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import {
  setTileCoords,
  unsetUserTileCoords,
} from '../redux/dominoSlice'
import {
  startDrag, stopDrag, startDrop,
} from '../redux/dragNdropSlice'
import { getNumbers } from '../util/tileOperations'
import DroppedPlaceholder from './DropPlaceholder'

const DominoTile = styled(motion.div)`
  margin: 1px;
  visibility: hidden;
  font-size: ${({ size }) => (
    size === 'sm'
      ? css`2rem`
      : size === 'md'
        ? css`3.5rem`
        : css`5rem`
  )};
  ${({ drag }) => (
    drag && css`cursor: move;`
  )}
  color: ${({ variant }) => (
    variant === 'selected'
      ? css`#9ce0d5`
      : variant === 'dimmed'
        ? css`#7e7e7e`
        : variant === 'droppable'
          ? css`aquamarine`
          : css`#b4b4b4`
  )};
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
  faceDown = false,
  duration = 0.3,
  variant = null,
  // in order styled components to work
  className,
}) => {
  const ref = useRef()
  const dispatch = useDispatch()
  const { firstInPlayline } = useSelector((state) => state.domino)
  const controls = useAnimation()

  // animate each tile after mount
  useEffect(() => {
    if (ref?.current) {
      // show the tile since it was hidden before animatiom
      ref.current.style.visibility = 'visible'
      // animate if previous position was set
      if (tile.lastCoords) {
      // read the current tile location to calculate translation x and y
        const coords = ref.current.getBoundingClientRect()
        // move the tile back to it's unmounting position
        controls.set({
          x: tile.lastCoords.x - coords.x,
          y: tile.lastCoords.y - coords.y,
        })
        // animate tile from previous to current location
        controls.start({
          x: 0,
          y: 0,
          transition: {
            duration,
            ease: 'easeOut',
          },
        }).then(() => {
        // if the tile is in the user's stock, disable future animations
          if (draggable) {
            dispatch(unsetUserTileCoords(tile))
          } else {
          // after animation save tile new position to start from on the next animation
            const rect = ref.current.getBoundingClientRect()
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
    }
  }, [])

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
  const getHtml = () => (faceDown ? (isHorizontal() ? '&#127024' : '&#127074') : `&#${(isHorizontal() ? 127025 : 127075) + parseInt(getNumbers(tile).join(''), 7)};`)

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

  // paint a tile with different colors
  const getVariant = () => (tile.id === firstInPlayline?.id ? 'selected' : variant)

  return (
    <>
      {first && (
      <DroppedPlaceholder tile={tile} first={first} last={last} isLeft />
      )}
      <DominoTile
        className={className}
        size={size}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: getHtml() }}
        variant={getVariant()}
      /* framer-motion props */
        animate={controls}
        drag={draggable}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragConstraints={{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        dragElastic={1}
        whileHover={draggable && { scale: 1.2 }}
      />
      {last && (
      <DroppedPlaceholder tile={tile} first={first} last={last} />
      )}
    </>
  )
}

export default Tile
