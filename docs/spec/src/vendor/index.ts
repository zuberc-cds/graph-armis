import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-vendor',
    name: 'Armis',
    entities: [
      {
        resourceName: 'Vendor',
        _type: 'armis_vendor',
        _class: ['Vendor'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
