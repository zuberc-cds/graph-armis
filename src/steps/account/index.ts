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

export async function fetchAccountDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const vendorEntity = await jobState.getData<Entity>(ARMIS_VENDOR_ENTITY_KEY);
  const accountEntity = await jobState.addEntity(createAccountEntity());

  await jobState.setData(ARMIS_ACCOUNT_ENTITY_KEY, accountEntity);
  await jobState.addRelationship(
    createAccountVendorRelationship(accountEntity, vendorEntity),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [Relationships.VENDOR_HOSTS_ACCOUNT],
    dependsOn: [Steps.VENDOR],
    executionHandler: fetchAccountDetails,
  },
];
