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

/**
 * Fetches sites from the API and saves them to job state.
 *
 * @param {IntegrationStepExecutionContext<IntegrationConfig>} options - The execution context options.
 */
export async function fetchSites({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Create API client
  const apiClient = createAPIClient(instance.config, logger);

  // Verify authentication
  await apiClient.verifyAuthentication();

  // Get account entity from job state
  const accountEntity = await jobState.getData<Entity>(
    ARMIS_ACCOUNT_ENTITY_KEY,
  );

  // Return if account entity does not exist
  if (!accountEntity) {
    logger.warn('Error fetching sites: accountEntity does not exist');
    return;
  }

  // Iterate over the sites and add entities and relationships to job state
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
    dependsOn: [Steps.ACCOUNT, Steps.DEVICES],
  },
];
