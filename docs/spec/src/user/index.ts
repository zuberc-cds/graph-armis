import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';
import { Steps } from '../../../../src/steps/constants';

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
    ],
    dependsOn: [Steps.ACCOUNT],
    implemented: true,
  },
];
