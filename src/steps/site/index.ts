import {
  Entity,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Steps,
  Relationships,
  ARMIS_ACCOUNT_ENTITY_KEY,
  ARMIS_DEVICE_ENTITY_KEY,
} from '../constants';
import {
  createAccountSiteRelationship,
  createSiteDeviceRelationship,
  createSiteEntity,
} from './converter';
import { ArmisSite } from '../../types';

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
    await jobState.setData(ARMIS_DEVICE_ENTITY_KEY, siteEntity);
    await jobState.addRelationship(
      createAccountSiteRelationship(accountEntity, siteEntity),
    );
  });
}

export async function buildSiteDeviceRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.SITE._type },
    async (siteEntity) => {
      const site = getRawData<ArmisSite>(siteEntity);

      if (!site) {
        logger.warn(
          { _key: siteEntity._key },
          'Could not get raw data for site entity',
        );
        return;
      }

      for (const siteId of site.networkEquipmentDeviceIds || []) {
        const deviceEntity = await jobState.findEntity(
          'armis_device_' + siteId,
        );

        if (!deviceEntity) {
          // throw new IntegrationMissingKeyError(
          //   `Expected device with key to exist (key=${'armis_device_2115'})`,
          // );
          logger.warn(
            `Expected device with key to exist (key=${
              'armis_device_' + siteId
            })`,
          );
        } else {
          await jobState.addRelationship(
            createSiteDeviceRelationship(siteEntity, deviceEntity),
          );
        }
      }
    },
  );
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
  {
    id: Steps.GROUP_USER_RELATIONSHIPS,
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [Relationships.SITE_HAS_DEVICES],
    dependsOn: [Steps.SITES],
    executionHandler: buildSiteDeviceRelationships,
  },
];
