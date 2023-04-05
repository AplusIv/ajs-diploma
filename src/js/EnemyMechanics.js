/* 
1) В ридропозишонс переключиться на enemy.
2) Считать позиции персонажей.
3) Определить самого сильного своего, самого слабого противника
4) Проверить его радиус атаки и движения (в индекс передать character.position).
5) Если не может атаковать самого слабого - подойти ближе.
6) Если может атаковать самого слабого - атаковать.
7) Если может атаковать нескольких слабых - продолжить атаковать кого атаковал в прошлом раунде.
 */

// Для определения персонажей игрока и противника
export function getCharacters(positionedTeams, classesArray) {
  const chars = [];
  positionedTeams.forEach(element => {
    if (classesArray.includes(element.character.type)) {
      console.log(element);
      chars.push(element);
    }
  });
  return chars;
}

// Найти персонажа по критерию (самый сильный, самый слабый и т.д.)
export function getDefineCharacter(characters, compareFn) {
  // Возможно, нужно добавить условие, что первый аргумент непустой
  if (Array.isArray(characters)) {
    characters.sort(compareFn); // Сортировка массива по убыванию на месте
    console.log(characters);
    return characters[0];
  }
  console.log(characters);
  return characters; // Остался единственный персонаж
}

export function checkPlayerPositions(players, enemies, defineCharacter) {
  // getDefineCharacter(enemies, (a, b) => b.character.attack - a.character.attack)
  const strongerEnemyAttackPositions = this.canAttackPositions(getDefineCharacter(enemies, (a, b) => b.character.attack - a.character.attack).position, enemies); 
  // canAttackPositions(index, positionedCharacters)

  // 1) Проверка возможности атаковать (найти всех, атаковать самого слабого)
  const playersUnderAttack = [];
  players.forEach((player) => {
    if (strongerEnemyAttackPositions.includes(player.position)) {
      playersUnderAttack.push(player);
    }
  });

  if (playersUnderAttack) {
    // если массив не пустой, проверим его длину, найдём самого слабого
    if (playersUnderAttack.length === 1) {
      const damage = Math.max(defineCharacter.character.attack - playersUnderAttack[0].character.defence, defineCharacter.character.attack * 0.1);
      console.log(damage);

      playersUnderAttack[0].character.health -= damage;

      console.log(this.gamePlay.showDamage(playersUnderAttack[0].position, damage)); // Добавить анимацию

      console.log(`Здоровье уменьшилось на ${damage} и равняется ${playersUnderAttack[0].character.health}`);
    }

    const weakestPlayer = getDefineCharacter(playersUnderAttack, (a, b) => a.character.health - b.character.health);
    const damage = Math.max(defineCharacter.character.attack - weakestPlayer.character.defence, defineCharacter.character.attack * 0.1);
    console.log(damage);

    weakestPlayer.character.health -= damage;

    console.log(this.gamePlay.showDamage(weakestPlayer.position, damage)); // Добавить анимацию

    console.log(`Здоровье уменьшилось на ${damage} и равняется ${weakestPlayer.character.health}`);
  } else {
    console.log(defineCharacter.position -= 1);
    defineCharacter.position -= 1;
  }

  this.gamePlay.redrawPositions(this.positionedTeams);


  // 2) Шагнуть ближе к противнику

  const alowedPositionsToGo = [...canGoPositions(this.defineBorder.bind(this), getDefineCharacter(enemies, (a, b) => b.character.attack - a.character.attack).position, getCharacters(positionedTeams, classesArray))];
  const playerToGo = getDefineCharacter(getCharacters(positionedTeams, classesArray), (a, b) => a.character.health - b.character.health);
  // Для каждой позиции проверить, при перемещении в новую точку, можно ли будет атаковать противника
  // Если да - перемещаться туда

  const step = alowedPositionsToGo.find((position) => this.canAttackPositions(position, enemies).includes(playerToGo.position));
  // Вернёт либо нужную позицию, на которую нужно перейти, либо undefined

  // цикл for На несколько ходов.
  // Протестировать атаку и передачу хода, если игрок вне зоны атаки.

  const strongestEnemy = getDefineCharacter(enemies, (a, b) => b.character.attack - a.character.attack);
  const initialPosition = strongestEnemy.position;
  const tracks = [];
  /* for (let index = 0; index < alowedPositionsToGo.length; index++) {
    const move = alowedPositionsToGo[index];
    strongestEnemy.position = move;
    // this.canAttackPositions(move, getCharacters(positionedTeams, classesArray))
  } */

};




  // Если самый сильный может атаковать
  /* for (let index = 0; index < players.length; index += 1) {
    const player = players[index];
    if (strongerEnemyAttackPositions.includes(player.position)) {
      const damage = Math.max(defineCharacter.character.attack - player.character.defence, defineCharacter.character.attack * 0.1);
      console.log(damage);

      player.character.health -= damage;

      console.log(this.gamePlay.showDamage(player.position, damage)); // Добавить анимацию

      console.log(`Здоровье уменьшилось на ${damage} и равняется ${player.character.health}`);
    }
  } */

  /* for (const player of playerPositions) {
    if (strongerEnemyAttackPositions.includes(player.position)) {
      const damage = Math.max(defineCharacter.character.attack - player.character.defence, defineCharacter.character.attack * 0.1);
      console.log(damage);

      player.character.health -= damage;

      console.log(this.gamePlay.showDamage(player.position, damage)); // Добавить анимацию

      console.log(`Здоровье уменьшилось на ${damage} и равняется ${player.character.health}`);
    }
  } */

function compareDescending(a, b) {
  b.character.attack - a.character.attack;
}

const compareAscending = ((a, b) => a.character.health - b.character.health);

function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a === b) return 0;
  if (a < b) return -1;
}

let arr = [ 1, 2, 15 ];

arr.sort(compareNumeric);

arr.sort((a, b) => b - a);