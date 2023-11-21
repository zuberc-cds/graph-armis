import { accountSteps } from './account';
import { deviceSteps } from './device';

const integrationSteps = [...accountSteps, ...deviceSteps];

export { integrationSteps };
