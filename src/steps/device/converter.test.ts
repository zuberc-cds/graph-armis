import { ArmisDevice } from '../../types';
import { createDeviceEntity } from './converter';

describe('#createDeviceEntity', () => {
  test('should convert to device entity', () => {
    const deviceEntity: ArmisDevice = {
      category: 'Computers',
      id: 2275,
      model: 'ThinkPad X1 Yoga 3rd Gen',
      name: '000000731194pc.corporate.acme.com',
      type: 'Laptops',
      manufacturer: 'Lenovo',
      operatingSystem: 'Windows',
      operatingSystemVersion: '10',
      lastSeen: '2023-11-03T17:00:42.069992+00:00',
      site: {
        name: 'Palo Alto Enterprise',
      },
    };
    expect(createDeviceEntity(deviceEntity)).toMatchSnapshot();
  });
});
