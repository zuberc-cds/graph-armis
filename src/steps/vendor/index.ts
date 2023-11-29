import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Steps, ARMIS_VENDOR_ENTITY_KEY } from '../constants';
import { createVendorEntity } from './converter';

export const SITE_ENTITY_KEY = 'entity:site';

export async function fetchVendor({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const vendorEntity = await jobState.addEntity(createVendorEntity());
  logger.info(`Created vendor entity: ${vendorEntity.id}`);
  await jobState.setData(ARMIS_VENDOR_ENTITY_KEY, vendorEntity);
}

export const vendorSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.VENDOR,
    name: 'Vendor',
    entities: [Entities.VENDOR],
    relationships: [],
    executionHandler: fetchVendor,
  },
];
