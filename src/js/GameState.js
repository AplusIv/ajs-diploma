export default class GameState {
  static from(object) {
    // TODO: create object
    return null;
  }
  //
  
  static getTeamCharactersClasses() {
    return {
      player: ['bowman', 'magician', 'swordsman'],
      enemy: ['daemon', 'undead', 'vampire'],
    }
  }

  static showPlayerCharacters() {
    return ['bowman', 'magician', 'swordsman'];
  }

  static showEnemyCharacters() {
    return ['daemon', 'undead', 'vampire'];
  }
}
