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

export function createAlertFindingEntity(sourceAlert: ArmisAlert): Entity {
  const severityMap = ['Low', 'Medium', 'High', 'Critical'];
  return createIntegrationEntity({
    entityData: {
      source: sourceAlert,
      assign: {
        _type: Entities.FINDING_ALERT._type,
        _class: Entities.FINDING_ALERT._class,
        _key: 'armis-alert-' + sourceAlert.alertId,
        category: sourceAlert.type,
        severity: sourceAlert.severity,
        numericSeverity:
          sourceAlert.severity === 'Unavailable' ||
          sourceAlert.severity === null
            ? 0
            : severityMap.indexOf(sourceAlert.severity),
        open: false,
        description:
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

export function createVulnerabilityFindingEntity(
  sourceVulnerability: ArmisVulnerability,
): Entity {
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
