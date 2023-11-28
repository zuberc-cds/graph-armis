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

export async function fetchDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);
  await apiClient.verifyAuthentication();

  const accountEntity = (await jobState.getData<Entity>(
    ARMIS_ACCOUNT_ENTITY_KEY,
  )) as Entity;
  if (!accountEntity) {
    logger.warn('Error fetching devices: accountEntity does not exist');
    return;
  }

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = createDeviceEntity(device);
    await jobState.addEntity(deviceEntity);
    await jobState.addRelationship(
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
    dependsOn: [Steps.ACCOUNT],
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
