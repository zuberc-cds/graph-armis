import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
describe('fetchDevices', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });

  test('fetch-devices', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-devices',
    });

    const stepConfig = buildStepTestConfigForStep(Steps.DEVICES);
    const stepResult = await executeStepWithDependencies(stepConfig);
    /*   eslint-disable no-console */
    console.log(stepResult, stepConfig.invocationConfig.integrationSteps[1]);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
