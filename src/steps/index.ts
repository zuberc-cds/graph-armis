import { accountSteps } from './account';
import { deviceSteps } from './device';
import { siteSteps } from './site';
import { findingSteps } from './finding';
import { userSteps } from './users';
import { vendorSteps } from './vendor';

const integrationSteps = [
  ...accountSteps,
  ...deviceSteps,
  ...siteSteps,
  ...findingSteps,
  ...vendorSteps,
  ...userSteps,
];

export { integrationSteps };
