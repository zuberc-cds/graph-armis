import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  PERSON: 'fetch-person',
  GROUPS: 'fetch-groups',
  SITE_DEVICES_RELATIONSHIPS: 'build-site-devices-relationships',
  DEVICES: 'fetch-devices',
  SITES: 'fetch-sites',
  FINDING: 'fetch-findings',
  FINDING_ALERTS: 'fetch-finding-alerts',
  FINDING_ALERTS_DEVICE_RELATIONSHIPS:
    'build-finding-alert-device-relationships',
  FINDING_DEVICE_RELATIONSHIPS: 'build-finding-device-relationships',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'GROUP'
  | 'USER'
  | 'PERSON'
  | 'DEVICE'
  | 'SITE'
  | 'FINDING'
  | 'FINDING_ALERT'
  | 'FINDING_VULNERABILITY',
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
        displayName: { type: 'string' },
        message: { type: 'string' },
      },
      required: ['category', 'lastSeen'],
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
        displayName: { type: 'string' },
      },
      required: ['id', 'location'],
    },
  },
  FINDING_ALERT: {
    resourceName: 'FindingAlert',
    _type: 'armis_finding_alert',
    _class: ['Finding'],
    schema: {
      properties: {
        alertId: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        classification: { type: 'string' },
        type: { type: 'string' },
        severity: { type: 'string' },
        status: { type: 'string' },
        time: { type: 'string' },
        deviceIds: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['classification', 'severity'],
    },
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'armis_finding',
    _class: ['Finding'],
    schema: {
      properties: {
        description: { type: 'string' },
        severity: { type: 'string' },
        status: { type: 'string' },
      },
    },
  },
  FINDING_VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'armis_vulnerability',
    _class: ['Vulnerability'],
    schema: {
      properties: {
        id: { type: 'string' },
        cveUid: { type: 'string' },
        affectedDevicesCount: { type: 'number' },
        attackComplexity: { type: 'string' },
        attackVector: { type: 'string' },
        availabilityImpact: { type: 'string' },
        cvssScore: { type: 'number' },
        epssPercentile: { type: 'number' },
        epssScore: { type: 'number' },
        exploitabilityScore: { type: 'number' },
        impactScore: { type: 'number' },
        integrityImpact: { type: 'string' },
        publishedDate: { type: 'string' },
        score: { type: 'number' },
        commonName: { type: 'string' },
        threatTags: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['cveUid', 'cvssScore', 'score'],
    },
  },
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'armis_account',
    _class: ['Account'],
    /*schema: {
      properties: {
        mfaEnabled: { type: 'boolean' },
        manager: { type: 'string' },
      },
      required: ['mfaEnabled', 'manager'],
    },*/
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
    _type: 'armis_user',
    _class: ['User'],
    schema: {
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        location: { type: 'string' },
        phone: { type: 'number' },
        roleAssignment: [
          {
            name: [{ type: 'string' }],
            sites: [{ type: 'string' }],
          },
        ],
        isActive: { type: 'boolean' },
        lastLoginTime: { type: 'string' },
        reportPermissions: { type: 'string' },
        twoFactorAuthentication: { type: 'boolean' },
        title: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' },
      },
      required: [
        'id',
        'email',
        'username',
        'twoFactorAuthentication',
        'isActive',
        'name',
      ],
    },
  },
  PERSON: {
    resourceName: 'Person',
    _type: 'armis_person',
    _class: ['Person'],
    schema: {
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        location: { type: 'string' },
        phone: { type: 'number' },
        roleAssignment: [
          {
            name: [{ type: 'string' }],
            sites: [{ type: 'string' }],
          },
        ],
        isActive: { type: 'boolean' },
        lastLoginTime: { type: 'string' },
        reportPermissions: { type: 'string' },
        twoFactorAuthentication: { type: 'boolean' },
        title: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' },
      },
      required: [
        'id',
        'email',
        'username',
        'twoFactorAuthentication',
        'isActive',
        'name',
      ],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_GROUP'
  | 'GROUP_HAS_USER'
  | 'ACCOUNT_MANAGES_DEVICES'
  | 'ACCOUNT_HAS_SITE'
  | 'DEVICE_HAS_FINDING_ALERT'
  | 'DEVICE_HAS_FINDING'
  | 'FINDING_VULNERABILITY_IS_VULNERABILITY'
  | 'SITE_HAS_DEVICES'
  | 'USER_IS_PERSON',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'armis_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_IS_PERSON: {
    _type: 'armis_user_is_person',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.IS,
    targetType: Entities.PERSON._type,
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
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SITE._type,
  },
  DEVICE_HAS_FINDING_ALERT: {
    _type: 'armis_device_has_finding_alert',
    sourceType: Entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.FINDING_ALERT._type,
  },
  DEVICE_HAS_FINDING: {
    _type: 'armis_device_has_finding',
    sourceType: Entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.FINDING._type,
  },
  FINDING_VULNERABILITY_IS_VULNERABILITY: {
    _type: 'armis_finding_is_vulnerability',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: Entities.FINDING_VULNERABILITY._type,
  },
  SITE_HAS_DEVICES: {
    _type: 'armis_site_has_device',
    sourceType: Entities.SITE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
};

export const ARMIS_ACCOUNT_ENTITY_KEY = Entities.ACCOUNT._type;
export const ARMIS_DEVICE_ENTITY_KEY = Entities.DEVICE._type;
export const ARMIS_SITE_ENTITY_KEY = Entities.SITE._type;
export const ARMIS_USER_ENTITY_KEY = Entities.USER._type;
