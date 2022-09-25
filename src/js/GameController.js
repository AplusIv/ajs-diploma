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

    // this.gamePlay.redrawPositions(enemyPositionedTeam);

    /* const playerStartPositions = [];
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
    } */

    /* function randomisePosition(positions) {
      const randomPosition = Math.floor(0 + Math.random() * ((positions.length - 1) + 1 - 0));
      return positions[randomPosition];
    } */

    
    /* function checkDoublePositions(positions, characterCount, checkingSet) {
      do {
        checkingSet.add(randomisePosition(positions));
        console.log(checkingSet);
      } while (checkingSet.size < characterCount); // если будет равен правому аперанду - снова уйдёт в цикл
      return checkingSet;
    } */

    /* function positionedTeams(team, positionsSet) {
      const positionedCharacterArray = [];
      for (let i = 0; i < team.characters.length; i += 1) {
        const positionedCharacter = new PositionedCharacter(team.characters[i], [...positionsSet][i]);
        console.log(positionedCharacter);
        positionedCharacterArray.push(positionedCharacter);
      }
      return positionedCharacterArray;
    } */

/*     const set = checkDoublePositions(playerStartPositions, 2, playerPositionsSet);

    const finalTeam = positionedTeams(playerTeam, set);
    console.log(finalTeam);
    
    this.gamePlay.redrawPositions(finalTeam); */

    for (let index = 0; index < this.gamePlay.cells.length; index += 1) {
      // this.gamePlay.addCellEnterListener(this.onCellEnter(index));
      // this.gamePlay.addCellLeaveListener(this.onCellLeave(index));
      // this.gamePlay.addCellClickListener(this.onCellClick(index));
    }

    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);


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

    /* while (checkingSet.size < characterCount) {
      checkingSet.add(randomisePosition(positions));
      console.log(checkingSet.size);  
      console.log(checkingSet);        
    }
    return checkingSet; */
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

 /*  showCharacterInfo(character) {
    if (character instanceof Character) {
      return `U+1F396${character.level} U+2694${character.attack} U+1F6E1${character.defence} U+2764${character.health}`
    }
  } */

  showCharacterInfo(index, characters) {
    for (const character of characters) {
      if (character.position === index) {
        return 'yeahyeah';
        //return `U+1F396${character.character.level} U+2694${character.character.attack} U+1F6E1${character.character.defence} U+2764${character.character.health}`;
      }
    }
    /* if (character instanceof Character) {
      return `U+1F396${character.level} U+2694${character.attack} U+1F6E1${character.defence} U+2764${character.health}`;
    } */
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    /* if (this.gamePlay.boardEl.children[index].hasChildNodes()) { // есть ли потомки в клетке
      this.gamePlay.showCellTooltip(this.showCharacterInfo(index, this.positionedTeams), index);
    } */
    // this.gamePlay.showCellTooltip('yeah', index);
    //this.gamePlay.showCellTooltip('message', index);
    // console.log(this.cellEnterListeners);
    console.log(this);
    console.log(this.boardSize);
    console.log('bazinga');
    console.log(index);
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    /* if (this.gamePlay.boardEl.children[index].hasChildNodes()) {
      this.gamePlay.hideCellTooltip(index);
    } */
    // this.gamePlay.hideCellTooltip(index);
    console.log(this);

    console.log('bazingaout');
    console.log(index);
    // TODO: react to mouse leave
  }
}
