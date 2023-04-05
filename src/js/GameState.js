export default class GameState {
  constructor() {
    this.playerCharacterClasses = ['bowman', 'magician', 'swordsman'];
    this.enemyCharacterClasses = ['daemon', 'undead', 'vampire'];
    this.side = 'player'; // Если true - ход игрока, если false - ход компьютера
  }

  /* static playerCharacterClasses = ['bowman', 'magician', 'swordsman'];
  static enemyCharacterClasses = ['daemon', 'undead', 'vampire'];
  static side = 'player'; // Если true - ход игрока, если false - ход компьютера */

  static from(object) {
    // TODO: create object
    return null;
  }
  //
  
  static getTeamCharactersClasses() {
    return {
      player: ['bowman', 'magician', 'swordsman'],
      enemy: ['daemon', 'undead', 'vampire'],
    };
  }

  get nextMove() {
    return this._nextMove;
  }

  set nextMove(who) {
    if (this.side !== who) {
      this.side = who;
    }
    this._nextMove = who;
  }

  // static showPlayerCharacters() {
  //   return ['bowman', 'magician', 'swordsman'];
  // }

  // static showEnemyCharacters() {
  //   return ['daemon', 'undead', 'vampire'];
  // }
}
