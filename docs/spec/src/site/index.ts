import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const siteSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://mydomain.armis.com/api/v1/sites
     * PATTERN: Fetch Entities
     */
    id: 'fetch-sites',
    name: 'Fetch Sites',
    entities: [
      {
        resourceName: 'Site',
        _type: 'armis_site',
        _class: ['Site'],
      },
    ],
    relationships: [
      {
        _type: 'armis_account_has_site',
        sourceType: 'armis_account',
        _class: RelationshipClass.HAS,
        targetType: 'armis_site',
      },
    ],
    dependsOn: [
      'fetch-account',
      'fetch-devices',
      'build-finding-device-relationships',
    ],
    implemented: true,
  },
];
