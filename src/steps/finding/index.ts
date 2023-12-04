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

/**
 * Fetches findings from the API and adds them to the job state.
 * @param instance - The integration instance.
 * @param jobState - The job state.
 * @param logger - The logger.
 */
export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Log that alerts are being fetched
  logger.info('Fetching Alerts');

  // Create an API client using the integration config and logger
  const apiClient = createAPIClient(instance.config, logger);

  // Verify authentication with the API client
  await apiClient.verifyAuthentication();

  // Iterate through each alert and add it to the job state
  await apiClient.iterateAlerts(async (alert) => {
    await jobState.addEntity(createAlertFindingEntity(alert));
  });
}

/**
 * Builds relationships between finding alert entities and device entities.
 *
 * @param jobState - The job state.
 * @param logger - The logger.
 */
export async function buildFindingAlertDeviceRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Iterate through each finding alert entity
  await jobState.iterateEntities(
    { _type: Entities.FINDING_ALERT._type },
    async (findingAlertEntity) => {
      // Get the raw data of the finding alert entity
      const alert = getRawData<ArmisAlert>(findingAlertEntity);

      // If the raw data is not available, log a warning and continue to the next entity
      if (!alert) {
        logger.warn(
          { _key: findingAlertEntity._key },
          'Could not get raw data for alert entity',
        );
        return;
      }

      // Iterate through each device ID in the alert's deviceIds array
      for (const deviceId of alert.deviceIds || []) {
        // Find the device entity with the corresponding device ID
        const deviceEntity = await jobState.findEntity(
          'armis-device-' + deviceId,
        );

        // If the device entity exists, add a relationship between the device and the finding alert
        if (deviceEntity) {
          await jobState.addRelationship(
            createDeviceFindingRelationship(deviceEntity, findingAlertEntity),
          );
        }
      }
    },
  );
}

/**
 * Fetches vulnerabilities from the API and adds them to the job state.
 *
 * @param instance - The integration instance.
 * @param jobState - The job state.
 * @param logger - The logger.
 */
export async function fetchVulnerabilities({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Log that vulnerabilities are being fetched
  logger.info('Fetching Vulnerabilities');

  // Create an API client using the integration config and logger
  const apiClient = createAPIClient(instance.config, logger);

  // Verify authentication with the API client
  await apiClient.verifyAuthentication();

  // Iterate through each vulnerability and add it to the job state
  await apiClient.iterateVulnerabilities(async (vulnerability) => {
    // Add the vulnerability entity to the job state
    const vulnerabilityEntity = await jobState.addEntity(
      createVulnerabilityFindingEntity(vulnerability),
    );

    // Add the finding entity to the job state
    const findingEntity = await jobState.addEntity(
      createFindingEntity(vulnerability),
    );

    // Add a relationship between the finding and vulnerability entities
    await jobState.addRelationship(
      createFindingVulnerabilityRelationship(
        findingEntity,
        vulnerabilityEntity,
      ),
    );
  });
}

/**
 * Builds relationships between devices and findings.
 *
 * @param {IntegrationStepExecutionContext<IntegrationConfig>} context - The execution context.
 */
export async function buildFindingDeviceRelationships(context) {
  const apiClient = createAPIClient(context.instance.config, context.logger);

  // Verify authentication with the API client
  await apiClient.verifyAuthentication();

  // Iterate over each device entity
  await context.jobState.iterateEntities(
    { _type: Entities.DEVICE._type },
    async (deviceEntity) => {
      // Iterate over each vulnerability of the device
      await apiClient.iterateDeviceVulnerabilities(
        deviceEntity._key.replace('armis-device-', ''),
        async (vul) => {
          const vulEntity = await context.jobState.findEntity(
            'armis-finding-' + vul.cveUid,
          );

          // Check if the vulnerability entity exists
          if (vulEntity) {
            // Add a relationship between the device and the finding
            await context.jobState.addRelationship(
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
