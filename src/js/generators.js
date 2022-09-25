// questionable
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
// Под вопросом


import Team from './Team';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const randomIndex = Math.floor(0 + Math.random() * ((allowedTypes.length - 1) + 1 - 0));
  const randomLevel = Math.floor(1 + Math.random() * (maxLevel + 1 - 1));
  yield new allowedTypes[randomIndex](randomLevel);

  yield* characterGenerator(allowedTypes, maxLevel); // композиция. Чтобы возращался новый персонаж бесконечное количество раз
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];
  for (let i = 0; i < characterCount; i += 1) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    characters.push(character);
  }
  return new Team(characters);
}
