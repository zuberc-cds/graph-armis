import { StepSpec, RelationshipClass } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-vendor',
    name: 'Armis',
    category: 'security',
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
