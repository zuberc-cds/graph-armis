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
  ARMIS_ACCOUNT_ENTITY_KEY,
  ARMIS_USER_ENTITY_KEY,
  Relationships,
} from '../constants';
import { createAccountUserRelationship, createUserEntity } from './converter';

export const SITE_ENTITY_KEY = 'entity:site';

export async function fetchUsers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await apiClient.verifyAuthentication();

  const accountEntity = await jobState.getData<Entity>(
    ARMIS_ACCOUNT_ENTITY_KEY,
  );
  if (!accountEntity) {
    logger.warn('Error fetching users: accountEntity does not exist');
    return;
  }

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
    await jobState.setData(ARMIS_USER_ENTITY_KEY, userEntity);
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    executionHandler: fetchUsers,
    dependsOn: [Steps.ACCOUNT],
  },
];
