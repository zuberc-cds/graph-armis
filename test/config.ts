import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_HOST = 'localhost';
const DEFAULT_API_KEY = 'dummy';
const DEFAULT_TIME_FRAME = '25';

export const integrationConfig: IntegrationConfig = {
  host: process.env.HOST || DEFAULT_HOST,
  apiKey: process.env.API_KEY || DEFAULT_API_KEY,
  timeFrame: process.env.TIME_FRAME || DEFAULT_TIME_FRAME,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
