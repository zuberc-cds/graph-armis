import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

/**
 * Creates an account entity.
 *
 * @return {Entity} The created account entity.
 */
export function createAccountEntity(): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: 'armis-account-1',
        name: 'Example Co. Armis Account',
      },
      assign: {
        _key: 'armis-account-1',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/Account.json
      },
    },
  });
}

/**
 * Creates a relationship between an account and a vendor.
 *
 * @param {Entity} account - The account entity.
 * @param {Entity} vendor - The vendor entity.
 * @return {Relationship} The created relationship.
 */
export function createAccountVendorRelationship(
  account: Entity,
  vendor: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HOSTS,
    from: vendor,
    to: account,
  });
}
