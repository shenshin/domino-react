export function getNumbers(tile) {
  const array = tile.id.split('')
  return tile.isRotated ? array.reverse() : array
}

export function getEdges(tiles) {
  return [getNumbers(tiles[0])[0], getNumbers(tiles[tiles.length - 1])[1]]
}

// puts inserting tile to the appropriate position in the playline
export function insertTileToPlayline({
  tile,
  playline,
  // true if inserting tile at the beginning of the playline
  // however it's not always possible
  position = true,
}) {
  const playlineEdges = getEdges(playline)
  const insertingEdges = getNumbers(tile)
  let goesLeft = false
  let isRotated = false
  const compare = (i1, i2) => playlineEdges[i1] === insertingEdges[i2]
  // in the beginning/end of the playline if the first/last digits of the playline tile
  // match with the first/last digits of the inserting tile,
  // then set the corresponding position and rotation
  if (position) {
    if (compare(0, 0)) {
      [goesLeft, isRotated] = [true, true]
    } else if (compare(0, 1)) {
      [goesLeft, isRotated] = [true, false]
    } else if (compare(1, 0)) {
      [goesLeft, isRotated] = [false, false]
    } else if (compare(1, 1)) {
      [goesLeft, isRotated] = [false, true]
    }
  } else if (compare(1, 0)) {
    [goesLeft, isRotated] = [false, false]
  } else if (compare(1, 1)) {
    [goesLeft, isRotated] = [false, true]
  }

  tile.isRotated = isRotated
  if (goesLeft) {
    playline.unshift(tile)
  } else {
    playline.push(tile)
  }
}
