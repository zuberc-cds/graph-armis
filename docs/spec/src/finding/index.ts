import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const findingAlertSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://mydomain.armis.com/api/v1/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-finding-alerts',
    name: 'Fetch Alerts',
    entities: [
      {
        resourceName: 'FindingAlert',
        _type: 'armis_finding_alert',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'armis_device_has_finding_alert',
        sourceType: 'armis_device',
        _class: RelationshipClass.HAS,
        targetType: 'armis_finding_alert',
      },
    ],
    dependsOn: ['fetch-devices'],
    implemented: true,
  },
];
