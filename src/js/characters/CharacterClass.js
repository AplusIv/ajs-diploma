/* 
Доработайте класс Character

Класс Character был спроектирован как базовый, чтобы вы могли унаследовать от него своих персонажей.
Поэтому неплохо бы запретить создавать объекты этого класса через new Character(level),
но при этом создание наследников должно работать без проблем:
new Daemon, где class Daemon extends Character.

Ознакомьтесь с документацией на new.target и реализуйте подобную логику,
выбрасывая ошибку в конструкторе Character.
*/

export default class Character {
  constructor(name, type) {
    if (typeof name === 'string' && name.length >= 2 && name.length <= 10) {
      this.name = name;
    } else {
      throw new Error('Wrong name, try again');
    }
    if (typeof type === 'string' && ['Bowman', 'Swordsman', 'Magician', 'Daemon', 'Undead', 'Zombie'].includes(type)) {
      this.type = type;
    } else {
      throw new Error('Wrong type, type not found, try again');
    }
    this.health = 100;
    this.level = 1;
    this.attack = undefined;
    this.defence = undefined;
  }

  levelUp() {
    if (this.health > 0) {
      this.level += 1;
      this.attack *= 1.2;
      this.defence *= 1.2;
      this.health = 100;
    } else {
      throw new Error("It's denied. You're dead");
    }
  }

  damage(points) {
    if (this.health > 0) {
      this.health -= points * (1 - this.defence / 100);
    } else {
      throw new Error("It's denied. Your health is 0 or less. You're dead");
    }
  }
}
