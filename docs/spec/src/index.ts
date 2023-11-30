import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { deviceSpec } from './device';
import { accountSpec } from './account';
import { findingAlertSpec } from './finding';
import { findingSpec } from './vulnerabilities';
import { siteSpec } from './site';
import { vendorSpec } from './vendor';
import { userSpec } from './user';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...deviceSpec,
    ...vendorSpec,
    ...userSpec,
    ...findingAlertSpec,
    ...findingSpec,
    ...siteSpec,
  ],
};
