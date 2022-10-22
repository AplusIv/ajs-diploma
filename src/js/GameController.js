import themes from "./themes";

import Character from "./Character";
import Bowman from "./characters/Bowman";
import Daemon from './characters/Daemon';
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

// import {characterGenerator, generateTeam} from './generators'; // Может просто generateTeam достаточно импортировать?
import { generateTeam } from "./generators";

import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import cursors from "./cursors";

// import { defineBorder, canGoPositions } from "./stepMechanics";
import canGoPositions from "./stepMechanics";

// import './themes';

// import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    //
    this.positionedTeams = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi(themes.prairie);

    /*  */
    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];

    const playerTeam = generateTeam(playerTypes, 4, 2);
    const enemyTeam = generateTeam(enemyTypes, 4, 2);

    const playerPositionsSet = new Set();
    const enemyPositionsSet = new Set();

    const startPositions = this.chooseAllStartPositions();

    this.getDifferentCharactersPositions(startPositions.playerStartPositions, 2, playerPositionsSet);
    this.getDifferentCharactersPositions(startPositions.enemyStartPositions, 2, enemyPositionsSet);

    const playerPositionedTeam = this.getPositionedTeam(playerTeam, playerPositionsSet);
    console.log(playerPositionedTeam);
    const enemyPositionedTeam = this.getPositionedTeam(enemyTeam, enemyPositionsSet);
    console.log(enemyPositionedTeam);

    this.positionedTeams = [...playerPositionedTeam, ...enemyPositionedTeam];
    console.log(this.positionedTeams);

    this.gamePlay.redrawPositions(this.positionedTeams);

    function showCharacterInfo(index, characters) {
      for (const character of characters) {
        if (character.position === index) {
          return `U+1F396${character.character.level} U+2694${character.character.attack} U+1F6E1${character.character.defence} U+2764${character.character.health}`;
        }
      }
      /* if (character instanceof Character) {
        return `U+1F396${character.level} U+2694${character.attack} U+1F6E1${character.defence} U+2764${character.health}`;
      } */
    }

    for (let index = 0; index < this.gamePlay.cells.length; index += 1) {
      // this.gamePlay.addCellEnterListener(this.onCellEnter(index));
      // this.gamePlay.addCellLeaveListener(this.onCellLeave(index));
      // this.gamePlay.addCellClickListener(this.onCellClick(index));
    }

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));


    // this.gamePlay.addCellEnterListener(this.onCellEnter(2));
    // this.gamePlay.addCellLeaveListener(this.onCellLeave(0));
  }

  chooseAllStartPositions() {
    const startPositions = {};
    const playerStartPositions = [];
    const enemyStartPositions = [];

    let index = 0;
    while (index < this.gamePlay.boardSize) {
      let firstRowPlayerPosition = index * this.gamePlay.boardSize;
      let secondRowPlayerPosition = firstRowPlayerPosition + 1;
      playerStartPositions.push(firstRowPlayerPosition, secondRowPlayerPosition);

      let firstRowEnemyPosition = this.gamePlay.boardSize - 2 + this.gamePlay.boardSize * index;
      let secondRowEnemyPosition = firstRowEnemyPosition + 1;
      enemyStartPositions.push(firstRowEnemyPosition, secondRowEnemyPosition);

      index += 1;
    }
    // startPositions.push(playerStartPositions, enemyStartPositions);
    startPositions.playerStartPositions = playerStartPositions;
    startPositions.enemyStartPositions = enemyStartPositions;
    return startPositions;
  }

  randomisePosition(positions) {
    const randomPosition = Math.floor(0 + Math.random() * ((positions.length - 1) + 1 - 0));
    return positions[randomPosition];
  }

  getDifferentCharactersPositions(positions, characterCount, checkingSet) {
    // const playerPositionsSet = new Set();
    do {
      checkingSet.add(this.randomisePosition(positions));
      console.log(checkingSet);
    } while (checkingSet.size < characterCount);
    // если будет равен правому аперанду - снова уйдёт в цикл
    return checkingSet;
  }

  getPositionedTeam(team, positionsSet) {
    const positionedCharacterArray = [];
    for (let i = 0; i < team.characters.length; i += 1) {
      const positionedCharacter = new PositionedCharacter(team.characters[i], [...positionsSet][i]);
      console.log(positionedCharacter);
      positionedCharacterArray.push(positionedCharacter);
    }
    return positionedCharacterArray;
  }

  showCharacterInfo(index, characters) {
    for (const character of characters) {
      if (character.position === index) {
        return `\u{1F396}${character.character.level} \u2694${character.character.attack} \u{1F6E1}${character.character.defence} \u2764${character.character.health}`;
      }
    }
    /* if (character instanceof Character) {
      return `U+1F396${character.level} U+2694${character.attack} U+1F6E1${character.defence} U+2764${character.health}`;
    } */
  }

  onCellClick(index) {
    // TODO: react to click
    console.log(this);
    console.log(`Клик по ячейке ${index}`);
    console.log(this.gamePlay.cells[index]);

    // let lastIndex;
    console.log(`Предыдущий индекс с персонажем = ${this.lastIndex}`);

    if (this.gamePlay.cells[index].hasChildNodes()) {
      /* for (let i = 0; i < this.cells.length; i += 1) {
        this.deselectCell(i); // Очищаю поле, при наведении на другую команду выделение пропадает
      } */
      if (this.lastIndex !== index && this.lastIndex) {
        this.gamePlay.deselectCell(this.lastIndex);

        // Определение урона
        let targetCharacter;
        for (let i = 0; i < this.positionedTeams.length; i += 1) {
          if (this.positionedTeams[i].position === index) {
            targetCharacter = this.positionedTeams[i];
            console.log('Индекс атакованного персонажа ', index);
          }
        }
        for (const character of this.positionedTeams) {
          if (character.position === this.lastIndex && this.gamePlay.cells[index].classList.contains('attackZone')) { // Можно атаковать
            console.log('Можно атаковать?', this.gamePlay.cells[index].classList.contains('attackZone'));
            console.log(targetCharacter.character.health);
            const damage = Math.max(character.character.attack - targetCharacter.character.defence, character.character.attack * 0.1);
            console.log(damage);
            // this.gamePlay.showDamage(index, damage).resolve((value) => value);

            targetCharacter.character.health -= damage;

            console.log(this.gamePlay.showDamage(index, damage));
            // console.log(this.gamePlay.showDamage(index, damage).then((value) => console.log(value)));
            // this.gamePlay.showDamage(index, damage).resolve().then((value) => console.log('Promise resolved', value), 1000);
            // this.gamePlay.showDamage(index, damage).then((value) => value);
            // this.gamePlay.showDamage(index, damage).resolve((value) => value);

            console.log(`Здоровье уменьшилось на ${damage} и равняется ${targetCharacter.character.health}`);

            // this.gamePlay.showDamage(index, damage).resolve();


            this.gamePlay.cells.forEach((i) => i.classList.remove('attackZone', 'goZone')); // Убираем визуальное оформление границ атаки (Можно добавить в redrawPositions)
            this.gamePlay.redrawPositions(this.positionedTeams);

            /* setTimeout(() => {
              this.gamePlay.cells.forEach((i) => i.classList.remove('attackZone', 'goZone')); // Убираем визуальное оформление границ атаки (Можно добавить в redrawPositions)
              this.gamePlay.redrawPositions(this.positionedTeams);
            }, 1000); */
          }
        }

        /* const canAtack = this.canAttackPositions(index, this.positionedTeams);
        canAtack.forEach((i) => {
          this.gamePlay.cells[i].classList.remove('attackZone');
          }); */
      }
      for (const characterClass of GameState.getTeamCharactersClasses().player) {
        if (this.gamePlay.cells[index].firstElementChild.classList.contains(characterClass)) {
          /* if (this.lastIndex !== index && this.lastIndex) {
            this.gamePlay.setCursor(cursors.pointer);
          } */
          this.gamePlay.selectCell(index);
          this.lastIndex = index;
          console.log(`Текущий индекс с персонажем = ${this.lastIndex}`);
        }
      }
    } // else GamePlay.showError('Персонаж не обнаружен');

    // Визуальное оформление границ атаки и хода
    if (this.isChosenCharacter() === index) {
      this.gamePlay.cells.forEach((i) => i.classList.remove('attackZone', 'goZone'));

      // this.gamePlay.cells.forEach((i) => i.classList.remove('goZone'));

      const canAtack = this.canAttackPositions(index, this.positionedTeams);
      canAtack.forEach((i) => {
        this.gamePlay.cells[i].classList.add('attackZone');
      });

      const canGo = [...canGoPositions(this.defineBorder.bind(this), index, this.positionedTeams)];
      // if (canGo.includes(index) && !this.gamePlay.cells[index].hasChildNodes()) {}
      canGo.forEach((i) => {
        this.gamePlay.cells[i].classList.add('goZone');
      });
    }

    if (this.gamePlay.cells[index].classList.contains('selected-green')) {
      console.log('Green');
      console.log(this.positionedTeams);
      console.log(this.isChosenCharacter);
      for (const character of this.positionedTeams) {
        if (character.position === this.isChosenCharacter()) {
          character.position = index;
          console.log(character.position);

          this.gamePlay.cells.forEach((i) => i.classList.remove('attackZone', 'goZone')); // Убираем визуальное оформление границ атаки (Можно добавить в redrawPositions)

          this.gamePlay.redrawPositions(this.positionedTeams);
        }
      }

      this.gamePlay.deselectCell(index); // Убрать зелёную подсветку с предыдущей ячейки
      this.gamePlay.deselectCell(this.isChosenCharacter()); // Убрать жёлтое выделение выбранного персонажа
    }

    /* if (this.gamePlay.cells[index].classList.contains('selected-green')) {
      for (const character of this.positionedTeams) {
        if (character.position === this.isChosenCharacter) {
          character.position = index;
          this.gamePlay.redrawPositions(this.positionedTeams);
        }
      }
      this.gamePlay.deselectCell(index); // Убрать зелёную подсветку с предыдущей ячейки
      this.gamePlay.deselectCell(this.isChosenCharacter); // Убрать жёлтое выделение выбранного персонажа
      // this.gamePlay.setCursor(cursors.auto); // Курсор для перехода
    } */
  }

  onCellEnter(index) {
    if (this.gamePlay.cells[index].hasChildNodes()) { // есть ли потомки в клетке
      this.gamePlay.setCursor(cursors.pointer); // Курсор наведён на люого персонажа
      this.gamePlay.showCellTooltip(this.showCharacterInfo(index, this.positionedTeams), index);
    }

    // Движение. Версия рабочая
    /* if (this.isChosenCharacter()) {
      const canGo = this.canGoPositions(this.isChosenCharacter(), this.positionedTeams);
      if (canGo.includes(index) && !this.gamePlay.cells[index].hasChildNodes()) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      }
    } */

    if (this.isChosenCharacter()) {
      const canGo = [...canGoPositions(this.defineBorder.bind(this), this.isChosenCharacter(), this.positionedTeams)];
      if (canGo.includes(index) && !this.gamePlay.cells[index].hasChildNodes()) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      }
    }


    // Вернуть
    /* if (this.isChosenCharacter()) {
      const canAtack = this.canAttackPositions(this.isChosenCharacter(), this.positionedTeams);
      if (canAtack.includes(index)) {
        console.log('redzone');
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      } else if (!canAtack.includes(index) && this.gamePlay.cells[index].hasChildNodes()) {
        // this.gamePlay.setCursor(cursors.notallowed); // Прописать классы врага для каждой команды
        // GamePlay.showError('Персонаж вне зоны поражения');
      }
    } */

    /* if (this.gamePlay.boardEl.children[index].hasChildNodes()) { // есть ли потомки в клетке
      this.gamePlay.showCellTooltip(this.showCharacterInfo(index, this.positionedTeams), index);
    } */
    console.log(this);
    console.log('bazinga');
    console.log(`Перешёл на ${index}`);
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    if (this.gamePlay.cells[index].hasChildNodes()) {
      if (this.gamePlay.cells[index].classList.contains('selected-yellow')) {
        // this.canGoPositions(index, this.positionedTeams);
        // console.log(GameState.getTeamCharactersClasses().player);
        // for (const characterClass of GameState.getTeamCharactersClasses().player) {
          // console.log(this.checkRadius(index, characterClass));
          // console.log(this.checkRadius(index, characterClass).includes(index));

          /* const characterPosition = index;
          if (this.gamePlay.cells[index].firstElementChild.classList.contains('magician')) {
            // if (characterClass === 'magician' && characterClass === 'daemon') {
              const allowedPositions = [];
              const borderPositions = new Set();

              let i = 0;
              while (i < this.gamePlay.boardSize) {
                borderPositions.add(i * this.gamePlay.boardSize); // left border
                borderPositions.add(this.gamePlay.boardSize - 1 + this.gamePlay.boardSize * i); // right border
                borderPositions.add(i); // top border
                borderPositions.add((this.gamePlay.boardSize - 1) * this.gamePlay.boardSize + i); // bottom border

                i += 1;
              }
              console.log(borderPositions);

              if (!borderPositions.has(index)) {
                allowedPositions.push(
                  index, // чтобы нашелся в includes
                  index - 9,
                  index - 8,
                  index - 6,
                  index - 1,
                  index + 1,
                  index + 7,
                  index + 8,
                  index + 9,
                );
                console.log(allowedPositions);
              }
              // return allowedPositions;
            // }
            if (allowedPositions.includes(index)) {
              console.log('Can go');
              this.gamePlay.selectCell(index, 'green');
            }
          } */

          /* if (this.checkRadius(index, characterClass).includes(index)) { // курсор сместился на ячейку, и она содержится в массиве
            //this.gamePlay.setCursor(cursors.pointer); // Курсор показывает на ячейку, уда можно шагнуть
            console.log('Can go');
          } */
        // }
      }


      this.gamePlay.setCursor(cursors.auto); // Курсор для перехода на пустую клетку
      this.gamePlay.hideCellTooltip(index);
    }
    
    if (this.gamePlay.cells[index].classList.contains('selected-green')) {
      this.gamePlay.deselectCell(index); // Убрать зелёную подсветку с предыдущей ячейки
      // this.gamePlay.setCursor(cursors.auto); // Курсор для перехода
    }

    
    // Вернуть
    /* if (this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.gamePlay.deselectCell(index); // Убрать красную подсветку с предыдущей ячейки
      // this.gamePlay.setCursor(cursors.auto); // Курсор для перехода
    } */



    this.gamePlay.setCursor(cursors.auto); // Курсор по умолчанию

    /* if (this.gamePlay.boardEl.children[index].hasChildNodes()) {
      this.gamePlay.hideCellTooltip(index);
    } */
    // this.gamePlay.hideCellTooltip(index);
    console.log(this);

    console.log('bazingaout');
    console.log(index);
    // TODO: react to mouse leave
  }

  get lastIndex() {
    return this._lastIndex;
  }

  set lastIndex(index) {
    this._lastIndex = index;
  }

  /* checkRadius(index, characterClass) {
    const characterPosition = index;
    if (this.gamePlay.cells[index].firstElementChild.classList.contains(characterClass)) {
      if (characterClass === 'magician' && characterClass === 'daemon') {
        const allowedPositions = [];
        const borderPositions = new Set();

        let i = 0;
        while (i < this.gamePlay.boardSize) {
          borderPositions.add(i * this.gamePlay.boardSize); // left border
          borderPositions.add(this.gamePlay.boardSize - 1 + this.gamePlay.boardSize * i); // right border
          borderPositions.add(i); // top border
          borderPositions.add((this.gamePlay.boardSize - 1) * this.gamePlay.boardSize + i); // bottom border

          i += 1;
        }
        console.log(borderPositions);

        if (!borderPositions.has(index)) {
          allowedPositions.push(
            index, // чтобы нашелся в includes
            index - 9,
            index - 8,
            index - 7,
            index - 1,
            index + 1,
            index + 7,
            index + 8,
            index + 9,
          );
          console.log(allowedPositions);
        }
        return allowedPositions;
      }
    }
  } */





  /* canGoPositions(index, positionedCharacters) {
    const character = positionedCharacters.find((char) => char.position === index);
    const allowedPositions = [];

    if (character.character.type === 'magician' || character.character.type === 'daemon') {
      this.defineBorder(index, 1, 'left', allowedPositions);
      this.defineBorder(index, 1, 'right', allowedPositions);
      this.defineBorder(index, 1, 'top', allowedPositions);
      this.defineBorder(index, 1, 'bottom', allowedPositions);

      this.defineBorder(index, 1, 'top-left', allowedPositions);
      this.defineBorder(index, 1, 'bottom-right', allowedPositions);
      this.defineBorder(index, 1, 'bottom-left', allowedPositions);
      this.defineBorder(index, 1, 'top-right', allowedPositions);


      console.log(allowedPositions);
      return allowedPositions;
    }


    if (character.character.type === 'bowman' || character.character.type === 'vampire') {
      this.defineBorder(index, 2, 'left', allowedPositions);
      this.defineBorder(index, 2, 'right', allowedPositions);
      this.defineBorder(index, 2, 'top', allowedPositions);
      this.defineBorder(index, 2, 'bottom', allowedPositions);

      this.defineBorder(index, 2, 'top-left', allowedPositions);
      this.defineBorder(index, 2, 'bottom-right', allowedPositions);
      this.defineBorder(index, 2, 'bottom-left', allowedPositions);
      this.defineBorder(index, 2, 'top-right', allowedPositions);


      console.log(allowedPositions);
      return allowedPositions;
    }

    if (character.character.type === 'swordsman' || character.character.type === 'undead') {
      this.defineBorder(index, 4, 'left', allowedPositions);
      this.defineBorder(index, 4, 'right', allowedPositions);
      this.defineBorder(index, 4, 'top', allowedPositions);
      this.defineBorder(index, 4, 'bottom', allowedPositions);

      this.defineBorder(index, 4, 'top-left', allowedPositions);
      this.defineBorder(index, 4, 'bottom-right', allowedPositions);
      this.defineBorder(index, 4, 'bottom-left', allowedPositions);
      this.defineBorder(index, 4, 'top-right', allowedPositions);


      console.log(allowedPositions);
      return allowedPositions;
    }
  } */

  canAttackPositions(index, positionedCharacters) {
    const character = positionedCharacters.find((char) => char.position === index);
    // const allowedPositions = [];
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
      const attackZone = this.defineAtackZone(index, radius, direction, diagonalPositions);

      if (attackZone.positions.size === radius) {
        let { positions, leftBorderPositions, rightBorderPositions } = attackZone; // деструктуризация объекта
        positions = [...positions]; // перевод в массив
        console.log(diagonalPositions);
        console.log(direction);
        console.log(positions);
        console.log(positions[positions.length - 1]);
        
        let counterY = 0;
        if (direction === 'top-left') {
          const position = positions[positions.length - 1];
          for (let k = position; k < this.gamePlay.boardSize ** 2 && counterY <= radius * 2; k += this.gamePlay.boardSize) {
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
          for (let k = position; k < this.gamePlay.boardSize ** 2 && counterY <= radius * 2; k += this.gamePlay.boardSize) {
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
          for (let k = position; k >= 0 && counterY <= radius * 2; k -= this.gamePlay.boardSize) {
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
          for (let k = position; k >= 0 && counterY <= radius * 2; k -= this.gamePlay.boardSize) {
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

  isChosenCharacter() {
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if (this.gamePlay.cells[i].classList.contains('selected-yellow')) {
        return i;
      }
    }
    return false;
  }

  defineBorder(index, step, direction, positions) {
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
  }
  
  /* defineBorder(index, step, direction, positions) {
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
          positions.push(border);
        }
      }
    }
    
    if (direction === 'right') {
      for (let i = 0; i < step; i += 1) {
        if (border < this.gamePlay.boardSize * characterRow + this.gamePlay.boardSize - 1) {
          border += 1;
          canStep += 1;
          positions.push(border);
        }
      }
    }

    if (direction === 'top') {
      for (let i = 0; i < step; i += 1) {
        if (border - this.gamePlay.boardSize >= 0) {
          border -= this.gamePlay.boardSize;
          canStep += 1;
          positions.push(border);
        }
      }
    }

    if (direction === 'bottom') {
      for (let i = 0; i < step; i += 1) {
        if (border + this.gamePlay.boardSize <= this.gamePlay.boardSize ** 2 - 1) {
          border += this.gamePlay.boardSize;
          canStep += 1;
          positions.push(border);
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
            positions.push(border);
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
            positions.push(border);
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
            positions.push(border);
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
            positions.push(border);
            console.log(positions);
          }
        } else break;
      }
    }

    console.log(canStep);
    return canStep;
  } */

  defineAtackZone(index, step, direction, positions) {
    const characterRow = Math.floor(index / this.gamePlay.boardSize);

    const leftBorderPositions = new Set();
    const rightBorderPositions = new Set();
    const topBorderPositions = new Set();
    const bottomBorderPositions = new Set();

    const borderPositions = new Set();

    let i = 0;
    while (i < this.gamePlay.boardSize) {
      leftBorderPositions.add(i * this.gamePlay.boardSize); // left border
      rightBorderPositions.add(this.gamePlay.boardSize - 1 + this.gamePlay.boardSize * i); // right border
      topBorderPositions.add(i); // top border
      bottomBorderPositions.add((this.gamePlay.boardSize - 1) * this.gamePlay.boardSize + i); // bottom border

      borderPositions.add(i * this.gamePlay.boardSize); // left border
      borderPositions.add(this.gamePlay.boardSize - 1 + this.gamePlay.boardSize * i); // right border
      borderPositions.add(i); // top border
      borderPositions.add((this.gamePlay.boardSize - 1) * this.gamePlay.boardSize + i); // bottom border

      i += 1;
    }
    
    // console.log(leftBorderPositions);
    // console.log(rightBorderPositions);

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
