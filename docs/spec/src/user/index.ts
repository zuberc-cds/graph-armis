import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.provider.com/api/v1/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'armis_user',
        _class: ['User'],
      },
      {
        resourceName: 'AccessRole',
        _type: 'armis_access_role',
        _class: ['AccessRole'],
      },
      {
        resourceName: 'Person',
        _type: 'armis_person',
        _class: ['Person'],
      },
    ],
    relationships: [
      {
        _type: 'armis_account_has_user',
        sourceType: 'armis_account',
        _class: RelationshipClass.HAS,
        targetType: 'armis_user',
      },
      {
        _type: 'armis_user_is_person',
        sourceType: 'armis_user',
        _class: RelationshipClass.IS,
        targetType: 'armis_person',
      },
      {
        _type: 'armis_user_assigned_access_role',
        sourceType: 'armis_user',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'armis_access_role',
      },
    ],
    dependsOn: ['build-site-devices-relationships'],
    implemented: true,
  },
];
