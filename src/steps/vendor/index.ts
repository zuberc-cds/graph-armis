import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Steps, ARMIS_VENDOR_ENTITY_KEY } from '../constants';
import { createVendorEntity } from './converter';

export const SITE_ENTITY_KEY = 'entity:site';

/**
 * Fetches the vendor entity and adds it to the job state.
 *
 * @param {IntegrationStepExecutionContext<IntegrationConfig>} executionContext - The execution context.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export async function fetchVendor({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Add the vendor entity to the job state
  const vendorEntity = await jobState.addEntity(createVendorEntity());

  // Log the creation of the vendor entity
  logger.info(`Created vendor entity: ${vendorEntity.id}`);

  // Set the vendor entity data in the job state
  await jobState.setData(ARMIS_VENDOR_ENTITY_KEY, vendorEntity);
}

export const vendorSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.VENDOR,
    name: 'Vendor',
    entities: [Entities.VENDOR],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchVendor,
  },
];
