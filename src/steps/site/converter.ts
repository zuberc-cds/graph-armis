import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { ArmisSite } from '../../types';

export function createSiteEntity(sourceSite: ArmisSite): Entity {
  return createIntegrationEntity({
    entityData: {
      source: sourceSite,
      assign: {
        _type: Entities.SITE._type,
        _class: Entities.SITE._class,
        _key: 'armis_site_' + sourceSite.id.toString(),
        id: sourceSite.id.toString(),
        location: sourceSite.location,
        name: sourceSite.name,
        networkEquipmentDeviceIds: sourceSite.networkEquipmentDeviceIds,
        displayName: sourceSite.name || sourceSite.id.toString(),
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

export function createAccountSiteRelationship(
  account: Entity,
  site: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: site,
  });
}

export function createSiteDeviceRelationship(
  site: Entity,
  device: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: site,
    to: device,
  });
}
