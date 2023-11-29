import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { ArmisUser } from '../../types';

export function createUserEntity(sourceUser: ArmisUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: sourceUser,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: 'armis-user-' + sourceUser.id.toString(),
        id: sourceUser.id.toString(),
        email: sourceUser.email,
        mfaEnabled: sourceUser.twoFactorAuthentication,
        active: sourceUser.isActive,
        username: sourceUser.username,
        location: sourceUser.location,
      },
    },
  });
}

export function createPersonEntity(sourceUser: ArmisUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: sourceUser,
      assign: {
        _type: Entities.PERSON._type,
        _class: Entities.PERSON._class,
        _key: 'armis-person-' + sourceUser.id.toString(),
        id: sourceUser.id.toString(),
        email: sourceUser.email ? [sourceUser.email.toString()] : ['-'],
        firstName: sourceUser.name || 'NA',
        lastName: sourceUser.name || 'NA',
        phone: sourceUser.phone ? [sourceUser.phone.toString()] : ['-'],
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

export function createUserPersonRelationship(
  user: Entity,
  person: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IS,
    from: user,
    to: person,
  });
}
