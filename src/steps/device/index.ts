import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Steps,
  Relationships,
  ARMIS_ACCOUNT_ENTITY_KEY,
} from '../constants';
import {
  createAccountDeviceRelationship,
  createDeviceEntity,
} from './converter';

export const DEVICE_ENTITY_KEY = 'entity:device';

/**
 * Fetch devices from the API and add them to the job state.
 *
 * @param {IntegrationStepExecutionContext<IntegrationConfig>} context - The execution context.
 */
export async function fetchDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);
  const authToken = await apiClient.verifyAuthentication();
  if (!authToken) {
    return;
  }
  apiClient.setAuthToken(authToken);

  // Get the account entity from the job state
  const accountEntity = (await jobState.getData(
    ARMIS_ACCOUNT_ENTITY_KEY,
  )) as Entity;

  // If the account entity doesn't exist, log a warning and return
  if (!accountEntity) {
    logger.warn('Error fetching devices: accountEntity does not exist');
    return;
  }

  // Iterate over the devices using the API client
  await apiClient.iterateDevices(async (device) => {
    // Create a device entity from the device
    const deviceEntity = createDeviceEntity(device);

    // Add the device entity to the job state
    await jobState.addEntity(deviceEntity);

    // Add a relationship between the account entity and the device entity
    await jobState.addRelationship(
      createAccountDeviceRelationship(accountEntity, deviceEntity),
    );
  });
}

export const deviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.ACCOUNT_MANAGES_DEVICES],
    executionHandler: fetchDevices,
    dependsOn: [Steps.ACCOUNT],
  },
];
