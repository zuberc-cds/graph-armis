import { accountSteps } from './account';
import { deviceSteps } from './device';
import { siteSteps } from './site';
import { findingSteps } from './finding';

const integrationSteps = [
  ...accountSteps,
  ...deviceSteps,
  ...siteSteps,
  ...findingSteps,
];

export { integrationSteps };
