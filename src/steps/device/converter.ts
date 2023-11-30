import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { AcmeGroup, AcmeUser, ArmisDevice } from '../../types';

/**
 * Creates a device entity based on the given source device.
 *
 * @param {ArmisDevice} sourceDevice - The source device to create the entity from.
 * @return {Entity} The created entity.
 */
export function createDeviceEntity(sourceDevice: ArmisDevice): Entity {
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

/**
 * Creates a user entity based on the given AcmeUser object.
 *
 * @param {AcmeUser} user - The AcmeUser object used as the source of the entity.
 * @return {Entity} The created user entity.
 */
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

/**
 * Creates a group entity based on the provided AcmeGroup object.
 *
 * @param {AcmeGroup} - The AcmeGroup object used as the source for creating the entity.
 * @return {Entity} The created entity.
 */
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

/**
 * Creates a relationship between an account and a user.
 *
 * @param {Entity} account - The account entity.
 * @param {Entity} user - The user entity.
 * @return {Relationship} The created relationship.
 */
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

/**
 * Creates a relationship between an account and a group.
 *
 * @param {Entity} account - The account entity.
 * @param {Entity} group - The group entity.
 * @return {Relationship} The created relationship.
 */
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

/**
 * Creates a group-user relationship.
 *
 * @param {Entity} group - The group entity.
 * @param {Entity} user - The user entity.
 * @return {Relationship} The created relationship.
 */
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
