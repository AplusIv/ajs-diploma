import Swordsman from '../SwordsmanClass';

test('should return equal class of different characters', () => {
  const received = new Swordsman('John Doe', 'Swordsman');
  const expected = {
    name: 'John Doe',
    type: 'Swordsman',
    level: 1,
    health: 100,
    attack: 40,
    defence: 10,
  };
  expect(received).toEqual(expected);
});
