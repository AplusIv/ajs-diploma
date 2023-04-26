
// Доработать!!!

export default class CharacterMovement {
  /* constructor(characterIndex) {
    // this.gamePlay = gamePlay;
    this.characterIndex = characterIndex;
  } */

  /**
 * Метод собирает и возвращает массив позиций, которые может атаковать определённый персонаж
 *
 * @param index число-индекс персонажа, для которого определяются возможные ячейки для атаки
 * @param positionedCharacters массив спозиционированных персонажей, у одного из которых
 * определяются позиции для атаки
 *
 * @returns массив, содержащий позиции, которые может атаковать персонаж с индексом index
 *
 */
  canAttackPositions(index, positionedCharacters, boardSize, attackZone) {
    const character = positionedCharacters.find((char) => char.position === index);

    const diagonalPositions = new Set();
    const finalPositions = new Set();

    const diagonalDirections = ['top-left', 'bottom-right', 'bottom-left', 'top-right'];

    let radius;

    /* if (character.character.type === 'magician' || character.character.type === 'daemon') {
      radius = 4;
    }; */

    switch (character.character.type) {
      case 'magician':
        radius = 4;
        break;
      case 'daemon':
        radius = 4;
        break;
      case 'bowman':
        radius = 2;
        break;
      case 'vampire':
        radius = 2;
        break;
      case 'swordsman':
        radius = 1;
        break;
      case 'undead':
        radius = 1;
        break;
      default:
        radius = 0;
    }

    for (const direction of diagonalDirections) {
      // const attackZone = this.defineAtackZone(index, radius, direction, diagonalPositions, boardSize);

      if (attackZone.positions.size === radius) {
        const { positions, leftBorderPositions, rightBorderPositions } = attackZone; // деструктуризация объекта
        positions = [...positions]; // перевод в массив
        console.log(diagonalPositions);
        console.log(direction);
        console.log(positions);
        console.log(positions[positions.length - 1]);
        
        let counterY = 0;
        if (direction === 'top-left') {
          const position = positions[positions.length - 1];
          for (let k = position; k < boardSize ** 2 && counterY <= radius * 2; k += boardSize) {
            finalPositions.add(k);
            let lineCell = k;
            let counterX = 0;
            do {
              finalPositions.add(lineCell + 1);
              lineCell += 1;
              counterX += 1;
            } while (!rightBorderPositions.has(lineCell) && counterX < radius * 2);
            counterY += 1;
          }
        }

        if (direction === 'top-right') {
          const position = positions[positions.length - 1];
          for (let k = position; k < boardSize ** 2 && counterY <= radius * 2; k += boardSize) {
            finalPositions.add(k);
            let lineCell = k;
            let counterX = 0;

            do {
              finalPositions.add(lineCell - 1);
              lineCell -= 1;
              counterX += 1;
            } while (!leftBorderPositions.has(lineCell) && counterX < radius * 2); // Сначала отрабатывает цикл, потом увеличивается счётчик
            counterY += 1;
          }
        }

        if (direction === 'bottom-left') {
          const position = positions[positions.length - 1];
          for (let k = position; k >= 0 && counterY <= radius * 2; k -= boardSize) {
            finalPositions.add(k);
            let lineCell = k;
            let counterX = 0;
            do {
              finalPositions.add(lineCell + 1);
              lineCell += 1;
              counterX += 1;
            } while (!rightBorderPositions.has(lineCell) && counterX < radius * 2);
            counterY += 1;
          }
        }

        if (direction === 'bottom-right') {
          // for (let i = 0; this.defineBorder(index, 4, direction, diagonalPositions).positions[4-1] < this.gamePlay.boardSize ** 2)
          const position = positions[positions.length - 1];
          for (let k = position; k >= 0 && counterY <= radius * 2; k -= boardSize) {
            finalPositions.add(k);
            let lineCell = k;
            let counterX = 0;
            do {
              finalPositions.add(lineCell - 1);
              lineCell -= 1;
              counterX += 1;
            } while (!leftBorderPositions.has(lineCell) && counterX < radius * 2);
            counterY += 1;
            
            console.log(finalPositions);

            /* if (!topBorderPositions.has(k)) {
              finalPositions.add(k);
              for (let i = 0; i < 4; i += 1) {
                const lineCell = k;
                finalPositions.add(lineCell - i);

              //   if (!leftBorderPositions.has(lineCell - i)) {
              //     finalPositions.add(lineCell - i);
              //   }
              // }
            } else break;
          } */
          }
        }
        break;
      } else diagonalPositions.clear();
    }

    finalPositions.delete(index); // нельзя атаковать самого себя

    return Array.from(finalPositions);
  }

  // Оставить в GameController
  isChosenCharacter() {
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if (this.gamePlay.cells[i].classList.contains('selected-yellow')) {
        return i;
      }
    }
    return false;
  }

  defineBorder(index, step, direction, positions, boardSize) {
    const characterRow = Math.floor(index / this.gamePlay.boardSize);
  
    const leftBorderPositions = new Set();
    const rightBorderPositions = new Set();
  
    let i = 0;
    while (i < boardSize) {
      leftBorderPositions.add(i * boardSize); // left border
      rightBorderPositions.add(boardSize - 1 + boardSize * i); // right border
  
      i += 1;
    }
    
    console.log(leftBorderPositions);
    console.log(rightBorderPositions);
  
    let border = index;
    let canStep = 0;
    if (direction === 'left') {
      for (let i = 0; i < step; i += 1) {
        if (border > boardSize * characterRow) {
          border -= 1;
          canStep += 1;
          positions.add(border);
        }
      }
    }
    
    if (direction === 'right') {
      for (let i = 0; i < step; i += 1) {
        if (border < boardSize * characterRow + boardSize - 1) {
          border += 1;
          canStep += 1;
          positions.add(border);
        }
      }
    }
  
    if (direction === 'top') {
      for (let i = 0; i < step; i += 1) {
        if (border - boardSize >= 0) {
          border -= boardSize;
          canStep += 1;
          positions.add(border);
        }
      }
    }
  
    if (direction === 'bottom') {
      for (let i = 0; i < step; i += 1) {
        if (border + boardSize <= boardSize ** 2 - 1) {
          border += boardSize;
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
          border -= boardSize + 1;
          canStep += 1;
          if (border >= 0 && border <= boardSize ** 2 - 1) {
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
          border += boardSize + 1;
          canStep += 1;
          if (border >= 0 && border <= boardSize ** 2 - 1) {
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
          border += boardSize - 1;
          canStep += 1;
          // Добавить брейки по достижении границ
          if (border >= 0 && border <= boardSize ** 2 - 1) {
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
  
          border -= boardSize - 1;
          canStep += 1;
          if (border >= 0 && border <= boardSize ** 2 - 1) {
            positions.add(border);
            console.log(positions);
          }
        } else break;
      }
    }
  
    console.log(canStep);
    return canStep; // ПОдумать над тем, что должно возвращаться
  }

  defineAtackZone(index, step, direction, positions, boardSize) {
    const characterRow = Math.floor(index / boardSize);

    const leftBorderPositions = new Set();
    const rightBorderPositions = new Set();
    const topBorderPositions = new Set();
    const bottomBorderPositions = new Set();

    const borderPositions = new Set();

    let i = 0;
    while (i < boardSize) {
      leftBorderPositions.add(i * boardSize); // left border
      rightBorderPositions.add(boardSize - 1 + boardSize * i); // right border
      topBorderPositions.add(i); // top border
      bottomBorderPositions.add((boardSize - 1) * boardSize + i); // bottom border

      borderPositions.add(i * this.gamePlay.boardSize); // left border
      borderPositions.add(boardSize - 1 + boardSize * i); // right border
      borderPositions.add(i); // top border
      borderPositions.add((boardSize - 1) * boardSize + i); // bottom border

      i += 1;
    }
    
    // console.log(leftBorderPositions);
    // console.log(rightBorderPositions);

    let border = index;
    let canStep = 0;
    if (direction === 'left') {
      for (let i = 0; i < step; i += 1) {
        if (border > boardSize * characterRow) {
          border -= 1;
          canStep += 1;
          positions.add(border);
        }
      }
    }
    
    if (direction === 'right') {
      for (let i = 0; i < step; i += 1) {
        if (border < boardSize * characterRow + boardSize - 1) {
          border += 1;
          canStep += 1;
          positions.add(border);
        }
      }
    }

    if (direction === 'top') {
      for (let i = 0; i < step; i += 1) {
        if (border - boardSize >= 0) {
          border -= boardSize;
          canStep += 1;
          positions.add(border);
        }
      }
    }

    if (direction === 'bottom') {
      for (let i = 0; i < step; i += 1) {
        if (border + boardSize <= boardSize ** 2 - 1) {
          border += boardSize;
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
          border -= boardSize + 1;
          canStep += 1;
          if (border >= 0 && border <= boardSize ** 2 - 1) {
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
          border += boardSize + 1;
          canStep += 1;
          if (border >= 0 && border <= boardSize ** 2 - 1) {
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
          border += boardSize - 1;
          canStep += 1;
          // Добавить брейки по достижении границ
          if (border >= 0 && border <= boardSize ** 2 - 1) {
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

          border -= boardSize - 1;
          canStep += 1; // canStep?
          if (border >= 0 && border <= boardSize ** 2 - 1) {
            positions.add(border);
            console.log(positions);
          }
        } else break;
      }
    }

    // console.log(canStep);

    const zone = {
      positions, // Set
      leftBorderPositions,
      rightBorderPositions,
      topBorderPositions,
      bottomBorderPositions,
      borderPositions,
    };

    console.log(zone);
    return zone;
  }
}