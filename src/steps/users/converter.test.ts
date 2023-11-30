import { ArmisUser } from '../../types';
import { createUserEntity } from './converter';

describe('#createUserEntity', () => {
  test('should convert to user entity', () => {
    const userEntity: ArmisUser = {
      id: 1,
      email: 'test@gmail.com',
      isActive: true,
      lastLoginTime: '22/02/2020',
      location: 'USA',
      name: 'Test',
      phone: 9876543210,
      reportPermissions: '',
      role: 'admin',
      roleAssignment: [
        {
          name: ['read'],
          sites: ['crest'],
        },
      ],
      title: 'test',
      twoFactorAuthentication: true,
      username: 'dummy-user',
    };
    expect(createUserEntity(userEntity)).toMatchSnapshot();
  });
});
