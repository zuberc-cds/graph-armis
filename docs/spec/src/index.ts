import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { deviceSpec } from './device';
import { accountSpec } from './account';
import { vendorSpec } from './vendor';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...accountSpec, ...deviceSpec, ...vendorSpec],
};
