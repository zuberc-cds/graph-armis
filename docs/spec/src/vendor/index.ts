import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const vendorSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-vendor',
    name: 'Vendor',
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
