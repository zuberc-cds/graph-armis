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
import { createAccountSiteRelationship, createSiteEntity } from './converter';

export const SITE_ENTITY_KEY = 'entity:site';

export async function fetchSites({
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
    logger.warn('Error fetching sites: accountEntity does not exist');
    return;
  }

  await apiClient.iterateSites(async (site) => {
    const siteEntity = createSiteEntity(site);
    await jobState.addEntity(siteEntity);
    await jobState.addRelationship(
      createAccountSiteRelationship(accountEntity, siteEntity),
    );
  });
}

export const siteSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SITES,
    name: 'Fetch Sites',
    entities: [Entities.SITE],
    relationships: [Relationships.ACCOUNT_HAS_SITE],
    executionHandler: fetchSites,
    dependsOn: [Steps.ACCOUNT],
  },
];
