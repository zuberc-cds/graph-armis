import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';
import { Steps } from '../../../../src/steps/constants';

export const deviceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.provider.com/api/v1/devices
     * PATTERN: Fetch Entities
     */
    id: 'fetch-devices',
    name: 'Fetch Devices',
    entities: [
      {
        resourceName: 'Device',
        _type: 'armis_device',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'armis_account_manages_device',
        sourceType: 'armis_account',
        _class: RelationshipClass.MANAGES,
        targetType: 'armis_device',
      },
    ],
    dependsOn: [Steps.ACCOUNT, Steps.SITES],
    implemented: true,
  },
];
