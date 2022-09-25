/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  /* if (index === 0) {
    return 'top-left';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index === boardSize ** 2 - 1 - (boardSize - 1)) {
    return 'bottom-left';
  }
  if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  } */
  for (let i = 0; i < boardSize ** 2; i += 1) {
    if (index === 0) {
      return 'top-left';
    }
    if (index > 0 && index < boardSize - 1) {
      return 'top';
    }
    if (index === boardSize - 1) {
      return 'top-right';
    }
    if (index === boardSize * i && i < boardSize) {
      return 'left';
    }
    if (index === boardSize * i - 1 && i > 0 && i < boardSize) {
      return 'right';
    }
    if (index === boardSize ** 2 - 1 - (boardSize - 1)) {
      return 'bottom-left';
    }
    if (index > boardSize ** 2 - boardSize && index < boardSize ** 2 - 1) {
      return 'bottom';
    }
    if (index === boardSize ** 2 - 1) {
      return 'bottom-right';
    }
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
