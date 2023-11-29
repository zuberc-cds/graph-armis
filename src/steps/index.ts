import { accountSteps } from './account';
import { deviceSteps } from './device';
import { siteSteps } from './site';
import { findingSteps } from './finding';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...deviceSteps,
  ...siteSteps,
  ...findingSteps,
  ...userSteps,
];

export { integrationSteps };
