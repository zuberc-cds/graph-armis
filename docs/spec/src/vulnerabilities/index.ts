import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const findingSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://mydomain.armis.com/api/v1/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-findings',
    name: 'Fetch Vulnerabilities',
    entities: [
      {
        resourceName: 'Vulnerability',
        _type: 'armis_vulnerability',
        _class: ['Vulnerability'],
      },
      {
        resourceName: 'Finding',
        _type: 'armis_finding',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'armis_finding_is_vulnerability',
        sourceType: 'armis_finding',
        _class: RelationshipClass.IS,
        targetType: 'armis_vulnerability',
      },
    ],
    dependsOn: ['fetch-devices', 'fetch-finding-alerts'],
    implemented: true,
  },
];
