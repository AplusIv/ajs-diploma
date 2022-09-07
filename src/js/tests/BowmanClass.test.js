import Bowman from '../BowmanClass';

test('should return equal class of different characters', () => {
  const received = new Bowman('John Doe', 'Bowman');
  const expected = {
    name: 'John Doe',
    type: 'Bowman',
    level: 1,
    health: 100,
    attack: 25,
    defence: 25,
  };
  expect(received).toEqual(expected);
});
