import { StepSpec, RelationshipClass } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
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
    relationships: [
      {
        _type: 'armis_vendor_hosts_account',
        sourceType: 'armis_vendor',
        _class: RelationshipClass.HOSTS,
        targetType: 'armis_account',
      },
    ],
    dependsOn: ['fetch-vendor'],
    implemented: true,
  },
];
