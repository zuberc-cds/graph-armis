import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test.skip('fetch-sites', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-sites',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.SITES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
