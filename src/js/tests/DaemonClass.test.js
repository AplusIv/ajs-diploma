import Daemon from '../DaemonClass';

test('should return equal class of different characters', () => {
  const received = new Daemon('John Doe', 'Daemon');
  const expected = {
    name: 'John Doe',
    type: 'Daemon',
    level: 1,
    health: 100,
    attack: 10,
    defence: 40,
  };
  expect(received).toEqual(expected);
});
