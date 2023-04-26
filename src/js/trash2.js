import themes from './themes';

import Character from './Character';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

// import {characterGenerator, generateTeam} from './generators'; // Может просто generateTeam достаточно импортировать?
import { generateTeam } from './generators';

import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';

import CharacterMovement from './CharacterMovement';

// import { defineBorder, canGoPositions } from "./stepMechanics";
import canGoPositions from './stepMechanics';
// import { setInterval } from "core-js";

// For Enemy
import { getCharacters, getDefineCharacter } from './EnemyMechanics';

// import './themes';

// import GamePlay from "./GamePlay";



export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    //
    this.gameState = ''; // Для реализации движения и атаки компьютера
    this.positionedTeams = []; // добавил свойство для хранения текущих команд,
    // содержащих спозиционированные экземпляры классов персонажей

    this.CharacterMovement = CharacterMovement;

    this.onCellEnter = this.onCellEnter.bind(this); // Одалживаю метод класса GamePlay
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi(themes.prairie);

    /*  */
    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];

    const playerTeam = generateTeam(playerTypes, 4, 2); // экземпляр new Team команды игрока
    const enemyTeam = generateTeam(enemyTypes, 4, 2); // экземпляр new Team команды соперника

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
    // запись свойства экземпляра класса GameController
    console.log(this.positionedTeams);

    this.gamePlay.redrawPositions(this.positionedTeams); // отрисовка новых персонажей

    // Определить ход команд
    const gameState = new GameState();
    console.log(gameState.nextMove); // player
    this.gameState = gameState;

    // Сэт интервал с проверкой чей ход
    
    const timer = setInterval(() => {
      if (this.gameState.side === 'enemy') {
        console.log(this.gameState.side);
        // console.log(`Передаём ход ${this.gameState.side}`);
        const enemies = getCharacters(this.positionedTeams, this.gameState.enemyCharacterClasses);
        const players = getCharacters(this.positionedTeams, this.gameState.playerCharacterClasses);

        const strongestEnemy = getDefineCharacter(enemies, (a, b) => b.character.attack - a.character.attack);
        console.log(strongestEnemy);

        const weakestPlayer = getDefineCharacter(players, (a, b) => a.character.health - b.character.health);
        console.log(weakestPlayer);


        const strongerEnemyAttackPositions = this.canAttackPositions(strongestEnemy.position, enemies); 
        // canAttackPositions(index, positionedCharacters)
        console.log(strongerEnemyAttackPositions);

        // 1) Проверка возможности атаковать (найти всех, атаковать самого слабого)
        const playersUnderAttack = [];
        players.forEach((player) => {
          if (strongerEnemyAttackPositions.includes(player.position)) {
            playersUnderAttack.push(player);
          }
        });

        console.log(playersUnderAttack);

        if (playersUnderAttack.length > 0) {
          // если массив не пустой, проверим его длину, найдём самого слабого
          if (playersUnderAttack.length === 1) {
            const damage = Math.max(strongestEnemy.character.attack - playersUnderAttack[0].character.defence, strongestEnemy.character.attack * 0.1);
            console.log(damage);

            playersUnderAttack[0].character.health -= damage;

            console.log(this.gamePlay.showDamage(playersUnderAttack[0].position, damage)); // Добавить анимацию

            console.log(`Здоровье уменьшилось на ${damage} и равняется ${playersUnderAttack[0].character.health}`);
          }
          const weakestOfPlayersUnderAttack = getDefineCharacter(playersUnderAttack, (a, b) => a.character.health - b.character.health);
          const damage = Math.max(strongestEnemy.character.attack - weakestOfPlayersUnderAttack.character.defence, strongestEnemy.character.attack * 0.1);
          console.log(damage);

          weakestOfPlayersUnderAttack.character.health -= damage;

          console.log(this.gamePlay.showDamage(weakestOfPlayersUnderAttack.position, damage)); // Добавить анимацию

          console.log(`Здоровье уменьшилось на ${damage} и равняется ${weakestOfPlayersUnderAttack.character.health}`);
        } else {
          // console.log(strongestEnemy.position -= 1);
          // strongestEnemy.position -= 1;

          const alowedPositionsToGo = [...canGoPositions(this.defineBorder.bind(this), strongestEnemy.position, enemies)];
          // const playerToGo = getDefineCharacter(getCharacters(positionedTeams, classesArray), (a, b) => a.character.health - b.character.health);
          
          console.log(`Противник может переместиться на ${alowedPositionsToGo}`);

          // Для каждой позиции проверить, при перемещении в новую точку, можно ли будет атаковать противника
          // Если да - перемещаться туда

          // const step = alowedPositionsToGo.find((position) => this.canAttackPositions(position, enemies).includes(weakestPlayer.position));
          // Вернёт либо нужную позицию, на которую нужно перейти, либо undefined

          // цикл for На несколько ходов.
          // Протестировать атаку и передачу хода, если игрок вне зоны атаки.

          const initialPosition = strongestEnemy.position;
          const tracks = [];
          tracks.push(initialPosition);

          // strongerEnemyAttackPositions

          const playersUnderAttack = [];
          players.forEach((player) => {
            if (strongerEnemyAttackPositions.includes(player.position)) {
              playersUnderAttack.push(player);
            }
          });

          /* while (condition) {
            
          } */

          /* const tracks2 = [];
          tracks2.push(initialPosition);

          for (let index = 0; index < alowedPositionsToGo.length; index += 1) {
            const element = array[index];
            const move = alowedPositionsToGo[index];
            strongestEnemy.position = move;
            if (this.canAttackPositions(move, enemies).find(element => element === weakestPlayer.position)) {
              console.log(this.canAttackPositions(move, enemies).find(element => element === weakestPlayer.position));
              tracks.push(move);
              break;
            } else {
              [...canGoPositions(this.defineBorder.bind(this), strongestEnemy.position, enemies)]
              tracks2.push([]);
            }
          } */

          /* do {
            for (let index = 0; index < alowedPositionsToGo.length; index += 1) {
              const element = array[index];
              const move = alowedPositionsToGo[index];
              strongestEnemy.position = move;
            }
          } while (this.canAttackPositions(strongestEnemy.position, enemies).includes(player.position) === false); */

          for (let index = 0; index < alowedPositionsToGo.length; index += 1) {
            const move = alowedPositionsToGo[index];
            strongestEnemy.position = move;
            if (this.canAttackPositions(move, enemies).find(element => element === weakestPlayer.position)) {
              console.log(this.canAttackPositions(move, enemies).find(element => element === weakestPlayer.position));
              tracks.push(move);
              break;
            }
          }
          console.log(tracks);
          strongestEnemy.position = tracks[tracks.length - 1];
        }

        this.gamePlay.redrawPositions(this.positionedTeams);
        this.gameState.nextMove = 'player';
        console.log(this.gameState);

      }
      console.log(`Сейчас ходит ${this.gameState.side}`);
    }, 1000); // таймаут для проверки чей ход
    // 

    // Повторяется
    function showCharacterInfo(index, characters) {
      for (const character of characters) {
        if (character.position === index) {
          return `U+1F396${character.character.level} U+2694${character.character.attack} U+1F6E1${character.character.defence} U+2764${character.character.health}`;
        }
      }
    }

    // this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    // this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    // this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // Реакции на перемещение и выбор ячеек
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  /**
 * Метод задаёт все возможные стартовые позиции для команд игрока и противника
 * и возвращает их в виде объекта startPositions
 *
 * @returns объект startPositions, содержащий массивы
 * со всеми возможными стартовыми позициями игрока и противника
 * в свойствах playerStartPositions и enemyStartPositions
 *
 */
  chooseAllStartPositions() {
    const startPositions = {};
    const playerStartPositions = [];
    const enemyStartPositions = [];

    let index = 0;
    while (index < this.gamePlay.boardSize) {
      const firstRowPlayerPosition = index * this.gamePlay.boardSize;
      const secondRowPlayerPosition = firstRowPlayerPosition + 1;
      playerStartPositions.push(firstRowPlayerPosition, secondRowPlayerPosition);

      const firstRowEnemyPosition = this.gamePlay.boardSize - 2 + this.gamePlay.boardSize * index;
      const secondRowEnemyPosition = firstRowEnemyPosition + 1;
      enemyStartPositions.push(firstRowEnemyPosition, secondRowEnemyPosition);

      index += 1;
    }

    startPositions.playerStartPositions = playerStartPositions;
    startPositions.enemyStartPositions = enemyStartPositions;
    return startPositions;
  }

  /**
 * Метод выбирает рандомную позицию для персонажа из массива переданных позиций
 * @param positions массив возможных позиций
 *
 * @returns одну позицию персонажа из переданного массива позиций (число)
 *
 */
  randomisePosition(positions) {
    const randomPosition = Math.floor(0 + Math.random() * ((positions.length - 1) + 1 - 0));
    return positions[randomPosition];
  }

  /**
 * Метод собирает экземпляр new Set(), содержащий уникальные позиции персонажей,
 * которые потом будут переданы соответствующим командам
 *
 * @param positions массив возможных позиций для каждого перснажа из команды
 * @param characterCount число персонажей в команде
 * @param checkingSet пустой new Set()
 *
 * @returns заполненный экземпляр Set, содержащий уникальные позиции для персонажей
 *
 */
  getDifferentCharactersPositions(positions, characterCount, checkingSet) {
    // const playerPositionsSet = new Set();
    do {
      checkingSet.add(this.randomisePosition(positions));
      console.log(checkingSet);
    } while (checkingSet.size < characterCount);
    // если будет равен правому аперанду - снова уйдёт в цикл
    return checkingSet;
  }

  /**
 * Метод формирует массив из спозиционированных экземпляров персонажей и возвращает его
 *
 * @param team экземпляр класса Team, который содержит экземпляры классов персонажей
 * @param positionsSet заполненный экземпляр Set, содержащий уникальные позиции для персонажей
 *
 * @returns массив из объектов класса PositionedCharacter
 * (спозиционированных экземпляров персонажей)
 *
 */
  getPositionedTeam(team, positionsSet) {
    const positionedCharacterArray = [];
    for (let i = 0; i < team.characters.length; i += 1) {
      const positionedCharacter = new PositionedCharacter(team.characters[i], [...positionsSet][i]);
      console.log(positionedCharacter);
      positionedCharacterArray.push(positionedCharacter);
    }
    return positionedCharacterArray;
  }

  // повторяется метод showCharacterInfo
  showCharacterInfo(index, characters) {
    for (const character of characters) {
      if (character.position === index) {
        return `\u{1F396}${character.character.level} \u2694${character.character.attack} \u{1F6E1}${character.character.defence} \u2764${character.character.health}`;
      }
    }
  }

  onCellClick(index) {
    // TODO: react to click
    console.log(this);

    console.log(GameState.enemyCharacterClasses);

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
            this.gameState.nextMove = 'enemy';
            console.log(this.gameState);

            /* setTimeout(() => {
              this.gamePlay.cells.forEach((i) => i.classList.remove('attackZone', 'goZone')); // Убираем визуальное оформление границ атаки (Можно добавить в redrawPositions)
              this.gamePlay.redrawPositions(this.positionedTeams);
            }, 1000); */
          }
        }
      }
      for (const characterClass of GameState.getTeamCharactersClasses().player) {
        if (this.gamePlay.cells[index].firstElementChild.classList.contains(characterClass)) {
          this.gamePlay.selectCell(index);
          this.lastIndex = index;
          console.log(`Текущий индекс с персонажем = ${this.lastIndex}`);
        }
      }
    } // else GamePlay.showError('Персонаж не обнаружен');

    // Визуальное оформление границ атаки и хода

    // !!! Добавить очистку границ при переходе на недоступную ячейку или содержащую вражеский персонаж

    if (this.isChosenCharacter() === index) {
      this.gamePlay.cells.forEach((i) => i.classList.remove('attackZone', 'goZone'));

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
          // 
          this.gameState.nextMove = 'enemy';
          console.log(this.gameState);
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


    // !!! Вернуть.
    // Необходимо модифицировать, подсвечивая красным только, если вражеский персонаж в ячейке

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

      }


      this.gamePlay.setCursor(cursors.auto); // Курсор для перехода на пустую клетку
      this.gamePlay.hideCellTooltip(index);
    }
    
    if (this.gamePlay.cells[index].classList.contains('selected-green')) {
      this.gamePlay.deselectCell(index); // Убрать зелёную подсветку с предыдущей ячейки
      // this.gamePlay.setCursor(cursors.auto); // Курсор для перехода
    }

    
    // !!! Вернуть
    /* if (this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.gamePlay.deselectCell(index); // Убрать красную подсветку с предыдущей ячейки
      // this.gamePlay.setCursor(cursors.auto); // Курсор для перехода
    } */



    this.gamePlay.setCursor(cursors.auto); // Курсор по умолчанию

    console.log(this);

    console.log('bazingaout');
    console.log(index);
    // TODO: react to mouse leave
  }

  /**
 * Гетер, который возвращает из экземпляра класса GameController сохранённое значение индекса,
 * где ранее находился курсор
 *
 * @returns индекс, где ранее находился курсор (число)
 *
 */
  get lastIndex() {
    return this._lastIndex;
  }

  /**
 * Сетер, который принимает значение индекса
 * и записывает его в свойство экземпляра класса GameController
 *
 * @param index текущий индекс (число)
 */
  set lastIndex(index) {
    this._lastIndex = index;
  }




  isChosenCharacter() {
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if (this.gamePlay.cells[i].classList.contains('selected-yellow')) {
        return i;
      }
    }
    return false;
  }

































/* 
Вынести в отдельный модуль

*/

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
