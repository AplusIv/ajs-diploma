/**
 * HOF, которая на основе переданного метода defineBorder формирует Set() позиций,
 * на которые может переместиться выбранный персонаж
 * @param fn функция defineBorder для определения допустимых индексов перемещений
 * @param index индекс выбранного персонажа
 * @param positionedCharacters массив спозиционированных персонажей
 * @returns Set() с индексами допустимых перемещений
 * */
export default function canGoPositions(fn, index, positionedCharacters) {
  const character = positionedCharacters.find((char) => char.position === index);
  const allowedPositions = new Set();

  if (character.character.type === 'magician' || character.character.type === 'daemon') {
    fn(index, 1, 'left', allowedPositions);
    fn(index, 1, 'right', allowedPositions);
    fn(index, 1, 'top', allowedPositions);
    fn(index, 1, 'bottom', allowedPositions);

    fn(index, 1, 'top-left', allowedPositions);
    fn(index, 1, 'bottom-right', allowedPositions);
    fn(index, 1, 'bottom-left', allowedPositions);
    fn(index, 1, 'top-right', allowedPositions);


    console.log(allowedPositions);
    // return allowedPositions;
  }


  if (character.character.type === 'bowman' || character.character.type === 'vampire') {
    fn(index, 2, 'left', allowedPositions);
    fn(index, 2, 'right', allowedPositions);
    fn(index, 2, 'top', allowedPositions);
    fn(index, 2, 'bottom', allowedPositions);

    fn(index, 2, 'top-left', allowedPositions);
    fn(index, 2, 'bottom-right', allowedPositions);
    fn(index, 2, 'bottom-left', allowedPositions);
    fn(index, 2, 'top-right', allowedPositions);


    console.log(allowedPositions);
    // return allowedPositions;
  }

  if (character.character.type === 'swordsman' || character.character.type === 'undead') {
    fn(index, 4, 'left', allowedPositions);
    fn(index, 4, 'right', allowedPositions);
    fn(index, 4, 'top', allowedPositions);
    fn(index, 4, 'bottom', allowedPositions);

    fn(index, 4, 'top-left', allowedPositions);
    fn(index, 4, 'bottom-right', allowedPositions);
    fn(index, 4, 'bottom-left', allowedPositions);
    fn(index, 4, 'top-right', allowedPositions);


    console.log(allowedPositions);
    // return allowedPositions;
  }

  return allowedPositions;
}

/* import GameController from "./GameController";
import GamePlay from "./GamePlay";

function defineBorder(index, step, direction, positions) {
  const characterRow = Math.floor(index / this.gamePlay.boardSize);

  const leftBorderPositions = new Set();
  const rightBorderPositions = new Set();

  let i = 0;
  while (i < this.gamePlay.boardSize) {
    leftBorderPositions.add(i * this.gamePlay.boardSize); // left border
    rightBorderPositions.add(this.gamePlay.boardSize - 1 + this.gamePlay.boardSize * i); // right border

    i += 1;
  }
  
  console.log(leftBorderPositions);
  console.log(rightBorderPositions);

  let border = index;
  let canStep = 0;
  if (direction === 'left') {
    for (let i = 0; i < step; i += 1) {
      if (border > this.gamePlay.boardSize * characterRow) {
        border -= 1;
        canStep += 1;
        positions.add(border);
      }
    }
  }
  
  if (direction === 'right') {
    for (let i = 0; i < step; i += 1) {
      if (border < this.gamePlay.boardSize * characterRow + this.gamePlay.boardSize - 1) {
        border += 1;
        canStep += 1;
        positions.add(border);
      }
    }
  }

  if (direction === 'top') {
    for (let i = 0; i < step; i += 1) {
      if (border - this.gamePlay.boardSize >= 0) {
        border -= this.gamePlay.boardSize;
        canStep += 1;
        positions.add(border);
      }
    }
  }

  if (direction === 'bottom') {
    for (let i = 0; i < step; i += 1) {
      if (border + this.gamePlay.boardSize <= this.gamePlay.boardSize ** 2 - 1) {
        border += this.gamePlay.boardSize;
        canStep += 1;
        positions.add(border);
      }
    }
  }

  if (direction === 'top-left') {
    for (let i = 0; i < step; i += 1) {
      // if (border - this.gamePlay.boardSize - 1 >= 0) {
      if (!leftBorderPositions.has(border)) {
        // console.log(leftBorderPositions);
        border -= this.gamePlay.boardSize + 1;
        canStep += 1;
        if (border >= 0 && border <= this.gamePlay.boardSize ** 2 - 1) {
          positions.add(border);
          console.log(positions);
        }
      } else break;
    }
  }

  if (direction === 'bottom-right') {
    for (let i = 0; i < step; i += 1) {
      // if (border + this.gamePlay.boardSize + 1 <= this.gamePlay.boardSize ** 2 - 1) {
      if (!rightBorderPositions.has(border)) {
        // console.log(rightBorderPositions);
        border += this.gamePlay.boardSize + 1;
        canStep += 1;
        if (border >= 0 && border <= this.gamePlay.boardSize ** 2 - 1) {
          positions.add(border);
          console.log(positions);
        }
      } else break;
    }
  }

  if (direction === 'bottom-left') {
    for (let i = 0; i < step; i += 1) {
      // if (border + this.gamePlay.boardSize - 1 <= this.gamePlay.boardSize ** 2 - this.gamePlay.boardSize) {
      if (!leftBorderPositions.has(border)) {
        // console.log(leftBorderPositions);
        border += this.gamePlay.boardSize - 1;
        canStep += 1;
        // Добавить брейки по достижении границ
        if (border >= 0 && border <= this.gamePlay.boardSize ** 2 - 1) {
          positions.add(border);
          console.log(positions);
        }
      } else break;
    }
  }

  if (direction === 'top-right') {
    for (let i = 0; i < step; i += 1) {
      // if (border - this.gamePlay.boardSize + 1 >= this.gamePlay.boardSize - 1) {
      if (!rightBorderPositions.has(border)) {
        // console.log(rightBorderPositions);

        border -= this.gamePlay.boardSize - 1;
        canStep += 1;
        if (border >= 0 && border <= this.gamePlay.boardSize ** 2 - 1) {
          positions.add(border);
          console.log(positions);
        }
      } else break;
    }
  }

  console.log(canStep);
  return canStep;
} */