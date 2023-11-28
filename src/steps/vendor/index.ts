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
    ARMIS_VENDOR_ENTITY_KEY,
  } from '../constants';
  import {createVendorEntity,  } from './converter';
  
  export const SITE_ENTITY_KEY = 'entity:site';
  
  export async function fetchVendor({
    jobState,
  }: IntegrationStepExecutionContext<IntegrationConfig>) {
    
    const vendorEntity = await jobState.addEntity(createVendorEntity());
    await jobState.setData(ARMIS_VENDOR_ENTITY_KEY, vendorEntity);
    
  }
  
  export const vendorSteps: IntegrationStep<IntegrationConfig>[] = [
    {
      id: Steps.VENDOR,
      name: 'Vendor',
      entities: [Entities.VENDOR],
      relationships: [Relationships.VENDOR_HOSTS_ACCOUNT],
      executionHandler: fetchVendor,
    },
  ];
  
