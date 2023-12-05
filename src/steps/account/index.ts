import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  ARMIS_ACCOUNT_ENTITY_KEY,
  ARMIS_VENDOR_ENTITY_KEY,
  Relationships,
} from '../constants';
import {
  createAccountEntity,
  createAccountVendorRelationship,
} from './converter';

/**
 * Fetches the account details and performs necessary operations.
 *
 * @param {IntegrationStepExecutionContext<IntegrationConfig>} executionContext - The execution context.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export async function fetchAccountDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Retrieve the vendor entity from the job state
  const vendorEntity = await jobState.getData<Entity>(ARMIS_VENDOR_ENTITY_KEY);

  // Create the account entity and add it to the job state
  const accountEntity = await jobState.addEntity(createAccountEntity());

  // Set the account entity data in the job state
  await jobState.setData(ARMIS_ACCOUNT_ENTITY_KEY, accountEntity);

  // If a vendor entity exists, create a relationship between the account and vendor entities
  if (vendorEntity) {
    await jobState.addRelationship(
      createAccountVendorRelationship(accountEntity, vendorEntity),
    );
  }
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [Relationships.VENDOR_HOSTS_ACCOUNT],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];
