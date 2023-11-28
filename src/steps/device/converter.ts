import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { AcmeGroup, AcmeUser, ArmisDevice } from '../../types';

export function createDeviceEntity(sourceDevice: ArmisDevice): Entity {
  /* eslint-disable no-console */
  return createIntegrationEntity({
    entityData: {
      source: sourceDevice,
      assign: {
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        _key: 'armis-device-' + sourceDevice.id.toString(),
        id: 'armis-device-' + sourceDevice.id.toString(),
        deviceId: sourceDevice.id.toString(),
        category: 'asset',
        model: sourceDevice.model !== null ? sourceDevice.model : '',
        make: sourceDevice.manufacturer,
        lastSeen: sourceDevice.lastSeen,
        serial: sourceDevice.name,
        name:
          sourceDevice.name !== null
            ? sourceDevice.name
            : sourceDevice.id.toString(),
        displayName: sourceDevice.name,
        osName: sourceDevice.operatingSystem
          ? sourceDevice.operatingSystem
          : '',
        osVersion: sourceDevice.operatingSystemVersion
          ? sourceDevice.operatingSystemVersion
          : '',
      },
    },
  });
}

export function createUserEntity(user: AcmeUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: user.id,
        username: 'testusername',
        email: 'test@test.com',
        active: true, // this is a required property
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/User.json
        firstName: 'John',
      },
    },
  });
}

export function createGroupEntity(group: AcmeGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        _key: group.id,
        email: 'testgroup@test.com',
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/UserGroup.json
        logoLink: 'https://test.com/logo.png',
      },
    },
  });
}

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: user,
  });
}
export function createAccountGroupRelationship(
  account: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: group,
  });
}

export function createGroupUserRelationship(
  group: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: group,
    to: user,
  });
}

export function createAccountDeviceRelationship(
  account: Entity,
  device: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.MANAGES,
    from: account,
    to: device,
  });
}
