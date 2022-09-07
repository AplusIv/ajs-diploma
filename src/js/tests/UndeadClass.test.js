import Undead from '../UndeadClass';

test('should return equal class of different characters', () => {
  const received = new Undead('John Doe', 'Undead');
  const expected = {
    name: 'John Doe',
    type: 'Undead',
    level: 1,
    health: 100,
    attack: 25,
    defence: 25,
  };
  expect(received).toEqual(expected);
});
