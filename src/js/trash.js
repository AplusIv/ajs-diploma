class Character {
  constructor(level, type = 'generic') {
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    console.log(new.target.name);
    if (new.target.name === 'Character') throw new Error('cant instantiate an object from class Character');
    
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }
}

class Bowman extends Character {
  constructor(level) {
    super(level);
    this.attack = 25;
    this.defence = 25;
    this.type = 'bowman';
  }
}

class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.attack = 40;
    this.defence = 10;
    this.type = 'swordsman';
  }
}

class Magician extends Character {
  constructor(level, type) {
    super(level, type);
    this.attack = 10;
    this.defence = 40;
    this.type = 'magician';
  }
}

class Team {
  // TODO: write your logic here
  constructor(characters) {
    this.characters = [...characters];
  }
}

function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const randomIndex = Math.floor(0 + Math.random() * ((allowedTypes.length - 1) + 1 - 0));
  const randomLevel = Math.floor(1 + Math.random() * (maxLevel + 1 - 1));
  yield new allowedTypes[randomIndex](randomLevel);

  yield* characterGenerator(allowedTypes, maxLevel); // композиция. Чтобы возращался новый персонаж бесконечное количество раз
}

function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];
  for (let i = 0; i < characterCount; i+= 1) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    characters.push(character);
  }
  console.log(characters);
  return new Team(characters);
  
}

const playerTypes = [Bowman, Swordsman, Magician];

// console.log(generateTeam(playerTypes, 9, 4));

let team1 = generateTeam(playerTypes, 5, 4);

let team2 = generateTeam(playerTypes, 7, 3);





const playerTeam = generateTeam(playerTypes, 4, 2);
console.log(playerTeam);
console.log(playerTeam.characters);

// const enemyTeam = generateTeam(enemyTypes, 4, 2);

const playerStartPositions = [];
const enemyStartPositions = [];

let index = 0;
while (index < 8) {
  let firstRowPlayerPosition = index * 8;
  let secondRowPlayerPosition = firstRowPlayerPosition + 1;
  playerStartPositions.push(firstRowPlayerPosition, secondRowPlayerPosition);

  let firstRowEnemyPosition = 8 - 2 + 8 * index;
  let secondRowEnemyPosition = firstRowEnemyPosition + 1;
  enemyStartPositions.push(firstRowEnemyPosition, secondRowEnemyPosition);

  index += 1;
}

function randomisePosition(positions) {
  const randomPosition = Math.floor(0 + Math.random() * ((positions.length - 1) + 1 - 0));
  return positions[randomPosition];
}

const playerPositionsSet = new Set();
function checkDoublePositions(positions, characterCount, checkingSet) {
  /* do {
    checkingSet.add(randomisePosition(positions));
    console.log(checkingSet);
  } while (checkingSet.size < characterCount);
  return checkingSet; */

  while (checkingSet.size < characterCount) {
    checkingSet.add(randomisePosition(positions));
    console.log(checkingSet.size);  
    console.log(checkingSet);        
  }
  return checkingSet;

}

const set = checkDoublePositions(playerStartPositions, 2, playerPositionsSet)


class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }
}


function positionedTeams(team, positionsSet) {
  const positionedCharacterArray = [];
  for (let i = 0; i < team.characters.length; i += 1) {
    const positionedCharacter = new PositionedCharacter(team.characters[i],[...positionsSet][i]);
    console.log(positionedCharacter);
    positionedCharacterArray.push(positionedCharacter);
  }
  return positionedCharacterArray;
}

const finalTeam = positionedTeams(playerTeam, set);
console.log(finalTeam);

function onCellEnter(index) {
  /* if (this.gamePlay.boardEl.children[index].hasChildNodes()) { // есть ли потомки в клетке
    this.gamePlay.showCellTooltip(this.showCharacterInfo(index, this.positionedTeams), index);
  } */
  // this.gamePlay.showCellTooltip('yeah', index);

  // TODO: react to mouse enter
}

function showCharacterInfo(characters) {
  for (const character of characters) {
    // if (character.position === index) {
      console.log(`U+1F396${character.character.level} U+2694${character.character.attack} U+1F6E1${character.character.defence} U+2764${character.character.health}`);
    //}
  }
  /* if (character instanceof Character) {
    return `U+1F396${character.level} U+2694${character.attack} U+1F6E1${character.defence} U+2764${character.health}`;
  } */
}

showCharacterInfo(finalTeam);