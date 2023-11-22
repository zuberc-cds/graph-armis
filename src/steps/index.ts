import { accountSteps } from './account';
import { deviceSteps } from './device';
import { siteSteps } from './site';

const integrationSteps = [...accountSteps, ...deviceSteps, ...siteSteps];

export { integrationSteps };
