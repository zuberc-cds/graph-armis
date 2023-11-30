import { createVendorEntity } from './converter';

describe('#createVendorEntity', () => {
  test('should convert to vendor entity', () => {
    expect(createVendorEntity()).toMatchSnapshot();
  });
});
