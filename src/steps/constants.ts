import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  GROUP_USER_RELATIONSHIPS: 'build-user-group-relationships',
  DEVICES: 'fetch-devices',
  SITES: 'fetch-sites',
};

export const Entities: Record<
  'ACCOUNT' | 'GROUP' | 'USER' | 'DEVICE' | 'SITE',
  StepEntityMetadata
> = {
  DEVICE: {
    resourceName: 'Device',
    _type: 'armis_device',
    _class: ['Device'],
    schema: {
      properties: {
        category: { type: 'string' },
        model: { type: 'string' },
        manufacturer: { type: 'string' },
        lastSeen: { type: 'string' },
        id: { type: 'string' },
        name: { type: 'string' },
        operatingSystem: { type: 'string' },
        operatingSystemVersion: { type: 'string' },
      },
      required: ['category', 'id', 'model', 'manufacturer', 'lastSeen'],
    },
  },
  SITE: {
    resourceName: 'Site',
    _type: 'armis_site',
    _class: ['Site'],
    schema: {
      properties: {
        id: { type: 'string' },
        let: { type: 'string' },
        lng: { type: 'string' },
        location: { type: 'string' },
        name: { type: 'string' },
        parentId: { type: 'string' },
      },
      required: ['id', 'location'],
    },
  },
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'armis_account',
    _class: ['Account'],
    schema: {
      properties: {
        mfaEnabled: { type: 'boolean' },
        manager: { type: 'string' },
      },
      required: ['mfaEnabled', 'manager'],
    },
  },
  GROUP: {
    resourceName: 'UserGroup',
    _type: 'acme_group',
    _class: ['UserGroup'],
    schema: {
      properties: {
        email: { type: 'string' },
        logoLink: { type: 'string' },
      },
      required: ['email', 'logoLink'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'acme_user',
    _class: ['User'],
    schema: {
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        active: { type: 'boolean' },
        firstName: { type: 'string' },
      },
      required: ['username', 'email', 'active', 'firstName'],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_GROUP'
  | 'GROUP_HAS_USER'
  | 'ACCOUNT_MANAGES_DEVICES'
  | 'ACCOUNT_HAS_SITE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'acme_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'acme_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_USER: {
    _type: 'acme_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_MANAGES_DEVICES: {
    _type: 'armis_account_manages_device',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.DEVICE._type,
  },
  ACCOUNT_HAS_SITE: {
    _type: 'armis_account_has_site',
    sourceType: Entities.SITE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SITE._type,
  },
};

export const ARMIS_ACCOUNT_ENTITY_KEY = Entities.ACCOUNT._type;
