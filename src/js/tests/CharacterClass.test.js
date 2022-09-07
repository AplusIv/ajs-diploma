import Character from '../CharacterClass';

test.each([
  [4, new Error('Wrong name, try again')],
  ['A', new Error('Wrong name, try again')],
  ['StanlyManly', new Error('Wrong name, try again')],
])('should throw new Error "Wrong name, try again" if there is incorrect parameter', (name, error) => {
  expect(() => new Character(name, 'Bowman')).toThrowError(error);
});

test.each([
  [true, new Error('Wrong type, type not found, try again')],
  ['King', new Error('Wrong type, type not found, try again')],
])('should throw new Error "Wrong name, try again" if there is incorrect parameter', (type, error) => {
  expect(() => new Character('John Doe', type)).toThrowError(error);
});

test("should upgrade character's level", () => {
  const received = new Character('John Doe', 'Daemon');
  received.attack = 10;
  received.defence = 55;
  const expected = {
    name: 'John Doe',
    type: 'Daemon',
    level: 2,
    health: 100,
    attack: 12,
    defence: 66,
  };
  received.levelUp();

  expect(received.level).toBe(2);
  expect(received.attack).toBeCloseTo(12);
  expect(received.defence).toBeCloseTo(expected.defence);
});

test("method levelUp() should should throw new Error It's denied. You're dead", () => {
  const received = new Character('John Doe', 'Daemon');
  received.health = 0;

  expect(() => received.levelUp()).toThrowError(new Error("It's denied. You're dead"));
});

test("should refresh caracter's health if it was damaged", () => {
  const received = new Character('John Doe', 'Daemon');
  received.attack = 10;
  received.defence = 55;

  const expected = {
    name: 'John Doe',
    type: 'Daemon',
    level: 1,
    health: 91,
    attack: 10,
    defence: 55,
  };

  received.damage(20);
  expect(received.health).toBeCloseTo(expected.health);
});

test("metod damage(points) should throw new Error It's denied. Your health is 0 or less. You're dead", () => {
  const received = new Character('John Doe', 'Daemon');
  received.health = -5;

  expect(() => received.damage(25)).toThrowError(new Error("It's denied. Your health is 0 or less. You're dead"));
});
