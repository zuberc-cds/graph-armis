import {
  //IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import {
  createAlertFindingEntity,
  createDeviceFindingRelationship,
  createFindingEntity,
  createFindingVulnerabilityRelationship,
  createVulnerabilityFindingEntity,
} from './converter';
import { ArmisAlert /*ArmisDevice, ArmisFinding*/ } from '../../types';

export const DEVICE_ENTITY_KEY = 'entity:device';

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  logger.info('Fetching Alerts');
  const apiClient = createAPIClient(instance.config, logger);
  await apiClient.verifyAuthentication();

  await apiClient.iterateAlerts(async (alert) => {
    await jobState.addEntity(createAlertFindingEntity(alert));
  });
}

export async function buildFindingAlertDeviceRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.FINDING_ALERT._type },
    async (findingAlertEntity) => {
      const alert = getRawData<ArmisAlert>(findingAlertEntity);

      if (!alert) {
        logger.warn(
          { _key: findingAlertEntity._key },
          'Could not get raw data for alert entity',
        );
        return;
      }

      for (const deviceId of alert.deviceIds || []) {
        const deviceEntity = await jobState.findEntity(
          'armis-device-' + deviceId,
        );

        // if (!deviceEntity) {
        //   throw new IntegrationMissingKeyError(
        //     `Expected device with key to exist (key=${deviceId})`,
        //   );
        // }
        if (deviceEntity) {
          await jobState.addRelationship(
            createDeviceFindingRelationship(deviceEntity, findingAlertEntity),
          );
        }
      }
    },
  );
}

export async function fetchVulnerabilities({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  logger.info('Fetching Vulnerabilities');
  const apiClient = createAPIClient(instance.config, logger);
  await apiClient.verifyAuthentication();

  await apiClient.iterateVulnerabilities(async (vul) => {
    const vulnerability = await jobState.addEntity(
      createVulnerabilityFindingEntity(vul),
    );
    const finding = await jobState.addEntity(createFindingEntity(vul));
    await jobState.addRelationship(
      createFindingVulnerabilityRelationship(finding, vulnerability),
    );
  });
}

export async function buildFindingDeviceRelationships({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);
  await apiClient.verifyAuthentication();
  await jobState.iterateEntities(
    { _type: Entities.DEVICE._type },
    async (deviceEntity) => {
      await apiClient.iterateDeviceVulnerabilities(
        deviceEntity._key.replace('armis-device-', ''),
        async (vul) => {
          const vulEntity = await jobState.findEntity(
            'armis-finding-' + vul.cveUid,
          );

          // if (!deviceEntity) {
          //   throw new IntegrationMissingKeyError(
          //     `Expected device with key to exist (key=${deviceId})`,
          //   );
          // }
          if (vulEntity) {
            await jobState.addRelationship(
              createDeviceFindingRelationship(deviceEntity, vulEntity),
            );
          }
        },
      );
    },
  );
}

export const findingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDING_ALERTS,
    name: 'Fetch Alerts',
    entities: [Entities.FINDING_ALERT],
    relationships: [Relationships.DEVICE_HAS_FINDING_ALERT],
    executionHandler: fetchFindings,
    dependsOn: [Steps.DEVICES, Steps.SITES],
  },
  {
    id: Steps.FINDING_ALERTS_DEVICE_RELATIONSHIPS,
    name: 'Build Device -> Alert Relationships',
    entities: [],
    relationships: [Relationships.DEVICE_HAS_FINDING_ALERT],
    dependsOn: [Steps.DEVICES, Steps.FINDING_ALERTS],
    executionHandler: buildFindingAlertDeviceRelationships,
  },
  {
    id: Steps.FINDING,
    name: 'Fetch Vulnerabilities',
    entities: [Entities.FINDING_VULNERABILITY, Entities.FINDING],
    relationships: [Relationships.FINDING_VULNERABILITY_IS_VULNERABILITY],
    executionHandler: fetchVulnerabilities,
    dependsOn: [Steps.DEVICES, Steps.FINDING_ALERTS],
  },
  {
    id: Steps.FINDING_DEVICE_RELATIONSHIPS,
    name: 'Build Device -> Vulnerability Relationships',
    entities: [Entities.DEVICE, Entities.FINDING],
    relationships: [Relationships.DEVICE_HAS_FINDING],
    dependsOn: [Steps.DEVICES, Steps.FINDING_ALERTS, Steps.FINDING],
    executionHandler: buildFindingDeviceRelationships,
  },
];
