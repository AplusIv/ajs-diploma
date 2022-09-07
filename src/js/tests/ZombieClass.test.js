import Zombie from '../ZombieClass';

test('should return equal class of different characters', () => {
  const received = new Zombie('John Doe', 'Daemon');
  const expected = {
    name: 'John Doe',
    type: 'Daemon',
    level: 1,
    health: 100,
    attack: 40,
    defence: 10,
  };
  expect(received).toEqual(expected);
});
