import Magician from '../MagicianClass';

test('should return equal class of different characters', () => {
  const received = new Magician('John Doe', 'Magician');
  const expected = {
    name: 'John Doe',
    type: 'Magician',
    level: 1,
    health: 100,
    attack: 10,
    defence: 40,
  };
  expect(received).toEqual(expected);
});
