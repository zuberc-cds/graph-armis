import { createAccountEntity } from './converter';

describe('#createAccountEntity', () => {
  test('should convert to account entity', () => {
    expect(createAccountEntity()).toMatchSnapshot();
  });
});
