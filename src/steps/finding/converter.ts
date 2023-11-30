import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import {
  AcmeGroup,
  AcmeUser,
  ArmisAlert,
  ArmisFinding,
  ArmisVulnerability,
} from '../../types';

/**
 * Creates an Entity object for an Alert finding.
 *
 * @param sourceAlert - The source alert from which to create the Entity.
 * @returns The created Entity object.
 */
export function createAlertFindingEntity(sourceAlert: ArmisAlert): Entity {
  // Map of severity levels
  const severityMap = ['Low', 'Medium', 'High', 'Critical'];

  return createIntegrationEntity({
    entityData: {
      // Set the common properties for the Entity
      source: sourceAlert,
      assign: {
        _type: Entities.FINDING_ALERT._type,
        _class: Entities.FINDING_ALERT._class,
        _key: 'armis-alert-' + sourceAlert.alertId,
        category: sourceAlert.type,
        severity: sourceAlert.severity,
        numericSeverity:
          // Convert severity to numeric value (0 for 'Unavailable' or null)
          sourceAlert.severity === 'Unavailable' ||
          sourceAlert.severity === null
            ? 0
            : severityMap.indexOf(sourceAlert.severity),
        open: false,
        description:
          // Set description to empty string if null
          sourceAlert.description != null ? sourceAlert.description : '',
        status: sourceAlert.status,
        reportedOn: parseTimePropertyValue(sourceAlert.time),
        name: sourceAlert.title,
        policyTitle: sourceAlert.policyTitle,
        policyId: sourceAlert.policyId,
      },
    },
  });
}

/**
 * Creates a vulnerability finding entity based on the provided source vulnerability.
 * @param sourceVulnerability - The source vulnerability object.
 * @returns The created entity.
 */
export function createVulnerabilityFindingEntity(
  sourceVulnerability: ArmisVulnerability,
): Entity {
  // Map of severity values
  const severityMap = ['Low', 'Medium', 'High', 'Critical'];

  return createIntegrationEntity({
    entityData: {
      source: sourceVulnerability,
      assign: {
        _type: Entities.FINDING_VULNERABILITY._type,
        _class: Entities.FINDING_VULNERABILITY._class,
        _key: 'armis-vulnerability-' + sourceVulnerability.id,
        category: sourceVulnerability.attackVector,
        severity: sourceVulnerability.severity,
        blocking:
          sourceVulnerability.impactScore >= 9 &&
          sourceVulnerability.severity === 'Critical'
            ? true
            : false,
        numericSeverity:
          sourceVulnerability.severity === 'Unavailable' ||
          sourceVulnerability.severity === null
            ? 0
            : severityMap.indexOf(sourceVulnerability.severity),
        open: sourceVulnerability.status === 'Open' ? true : false,
        description:
          sourceVulnerability.description != null
            ? sourceVulnerability.description
            : '',
        status: sourceVulnerability.status,
        reportedOn: parseTimePropertyValue(sourceVulnerability.publishedDate),
        name: 'armis-vulnerability-' + sourceVulnerability.id,
        displayName: 'armis-vulnerability-' + sourceVulnerability.id,
        production: true,
        public:
          sourceVulnerability.threatTags != null
            ? sourceVulnerability.threatTags.indexOf('Publicly Available') !==
              -1
              ? true
              : false
            : false,
        score: sourceVulnerability.score,
        impact: sourceVulnerability.impactScore,
        exploitability: sourceVulnerability.exploitabilityScore,
        vector: sourceVulnerability.attackVector,
        impacts: ['devices'],
      },
    },
  });
}

/**
 * Creates a new Finding entity based on the provided source finding.
 * @param sourceFinding - The source finding object.
 * @returns The newly created Entity.
 */
export function createFindingEntity(sourceFinding: ArmisFinding): Entity {
  const severityMap = ['Low', 'Medium', 'High', 'Critical'];

  return createIntegrationEntity({
    entityData: {
      source: sourceFinding,
      assign: {
        _type: Entities.FINDING._type,
        _class: Entities.FINDING_ALERT._class,
        _key: 'armis-finding-' + sourceFinding.id,
        name: 'armis-finding-' + sourceFinding.id,
        displayName: 'armis-finding-' + sourceFinding.id,
        category: 'armis-finding',
        severity: sourceFinding.severity,
        numericSeverity:
          sourceFinding.severity === 'Unavailable' ||
          sourceFinding.severity === null
            ? 0
            : severityMap.indexOf(sourceFinding.severity),

        description:
          sourceFinding.description != null ? sourceFinding.description : '',
        status: sourceFinding.status,
        open: sourceFinding.status === 'Open' ? true : false,
      },
    },
  });
}

/**
 * Creates a user entity based on the provided user object.
 *
 * @param {AcmeUser} user - The user object used as the source for creating the entity.
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
 * Creates a group entity.
 *
 * @param {AcmeGroup} group - The group object used to create the entity.
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
 * Creates a relationship between a device and a finding.
 *
 * @param {Entity} device - The device to create the relationship for.
 * @param {Entity} finding - The finding to create the relationship with.
 * @return {Relationship} The created relationship between the device and the finding.
 */
export function createDeviceFindingRelationship(
  device: Entity,
  finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: device,
    to: finding,
  });
}

/**
 * Creates a relationship between a finding and a vulnerability.
 *
 * @param {Entity} finding - The finding entity.
 * @param {Entity} vulnerability - The vulnerability entity.
 * @return {Relationship} The created relationship.
 */
export function createFindingVulnerabilityRelationship(
  finding: Entity,
  vulnerability: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IS,
    from: finding,
    to: vulnerability,
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
 * @return {Relationship} The created relationship between the account and the group.
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
