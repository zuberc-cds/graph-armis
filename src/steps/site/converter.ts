import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { ArmisSite } from '../../types';

/**
 * Creates a site entity based on the provided source site.
 *
 * @param {ArmisSite} sourceSite - The source site to create the entity from.
 * @return {Entity} The created site entity.
 */
export function createSiteEntity(sourceSite: ArmisSite): Entity {
  return createIntegrationEntity({
    entityData: {
      source: sourceSite,
      assign: {
        _type: Entities.SITE._type,
        _class: Entities.SITE._class,
        _key: sourceSite.name + '-' + sourceSite.id.toString(),
        id: sourceSite.id.toString(),
        location: sourceSite.location,
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
 * Create an account-group relationship.
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

/**
 * Creates a relationship between an account and a site.
 *
 * @param {Entity} account - The account entity.
 * @param {Entity} site - The site entity.
 * @return {Relationship} The created relationship.
 */
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
