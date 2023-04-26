import Character from './Character';

/**
 * Экземпляр класса в свойствах this.character и this.position
 * cодержит информацию о конкретном экземпляре класса персонажа и его позиции
 */
export default class PositionedCharacter {
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
