import characterGenerator from './generators';


/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here

 // ??? Возможно нужно было сразу возвращать экземпляры классов в команды
 // !!! Обратите внимание на new в отличие от playerTypes в прошлом примере

  constructor(characters) {
    this.characters = [...characters];
  }
}
