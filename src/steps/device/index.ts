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
export async function fetchDevices(context) {
  // Create an API client using the instance config and logger
  const apiClient = createAPIClient(context.instance.config, context.logger);

  // Verify authentication with the API client
  await apiClient.verifyAuthentication();

  // Get the account entity from the job state
  const accountEntity = await context.jobState.getData(
    ARMIS_ACCOUNT_ENTITY_KEY,
  );

  // If the account entity doesn't exist, log a warning and return
  if (!accountEntity) {
    context.logger.warn('Error fetching devices: accountEntity does not exist');
    return;
  }

  // Iterate over the devices using the API client
  await apiClient.iterateDevices(async (device) => {
    // Create a device entity from the device
    const deviceEntity = createDeviceEntity(device);

    // Add the device entity to the job state
    await context.jobState.addEntity(deviceEntity);

    // Add a relationship between the account entity and the device entity
    await context.jobState.addRelationship(
      createAccountDeviceRelationship(accountEntity, deviceEntity),
    );
  });
}

/*export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = await jobState.addEntity(createGroupEntity(group));
    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, groupEntity),
    );
  });
}

export async function buildGroupUserRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.GROUP._type },
    async (groupEntity) => {
      const group = getRawData<AcmeGroup>(groupEntity);

      if (!group) {
        logger.warn(
          { _key: groupEntity._key },
          'Could not get raw data for group entity',
        );
        return;
      }

      for (const user of group.users || []) {
        const userEntity = await jobState.findEntity(user.id);

        if (!userEntity) {
          throw new IntegrationMissingKeyError(
            `Expected user with key to exist (key=${user.id})`,
          );
        }

        await jobState.addRelationship(
          createGroupUserRelationship(groupEntity, userEntity),
        );
      }
    },
  );
}*/

export const deviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.ACCOUNT_MANAGES_DEVICES],
    executionHandler: fetchDevices,
    dependsOn: [Steps.ACCOUNT, Steps.SITES],
  },
  /*{
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.ACCOUNT_HAS_GROUP],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchGroups,
  },
  {
    id: Steps.GROUP_USER_RELATIONSHIPS,
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.GROUPS, Steps.USERS],
    executionHandler: buildGroupUserRelationships,
  },*/
];
