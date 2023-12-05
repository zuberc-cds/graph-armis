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
  ARMIS_ACCESS_ROLE_ENTITY_KEY,
  ARMIS_PERSON_ENTITY_KEY,
} from '../constants';
import {
  createAccessRoleEntity,
  createAccountUserRelationship,
  createPersonEntity,
  createUserAccessRoleRelationship,
  createUserEntity,
  createUserPersonRelationship,
} from './converter';

export async function fetchUsers({
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

  const accountEntity = await jobState.getData<Entity>(
    ARMIS_ACCOUNT_ENTITY_KEY,
  );
  if (!accountEntity) {
    logger.warn('Error fetching users: accountEntity does not exist');
    return;
  }

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    const personEntity = createPersonEntity(user);
    const accessRoleEntity = createAccessRoleEntity(user);

    await jobState.addEntity(userEntity);
    await jobState.addEntity(personEntity);
    await jobState.addEntity(accessRoleEntity);

    await jobState.setData(ARMIS_USER_ENTITY_KEY, userEntity);
    await jobState.setData(ARMIS_PERSON_ENTITY_KEY, personEntity);
    await jobState.setData(ARMIS_ACCESS_ROLE_ENTITY_KEY, accessRoleEntity);

    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
    await jobState.addRelationship(
      createUserPersonRelationship(userEntity, personEntity),
    );
    await jobState.addRelationship(
      createUserAccessRoleRelationship(userEntity, accessRoleEntity),
    );
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER, Entities.ACCESS_ROLE, Entities.PERSON],
    relationships: [
      Relationships.ACCOUNT_HAS_USER,
      Relationships.USER_IS_PERSON,
      Relationships.USER_ASSIGNE_ACCESS_ROLE,
    ],
    executionHandler: fetchUsers,
    dependsOn: [Steps.SITE_DEVICES_RELATIONSHIPS],
  },
];
