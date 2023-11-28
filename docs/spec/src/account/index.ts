import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.provider.com/api/v1/accounts
     * PATTERN: Fetch Entities
     */
    id: 'fetch-account',
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: 'armis_account',
        _class: ['Account'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
