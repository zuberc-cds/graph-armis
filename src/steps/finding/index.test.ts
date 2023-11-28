// import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
// import { buildStepTestConfigForStep } from '../../../test/config';
// import { Recording, setupProjectRecording } from '../../../test/recording';
// import { Steps } from '../constants';

// // See test/README.md for details
// let recording: Recording;
// afterEach(async () => {
//   await recording.stop();
// });

// test('fetch-alerts', async () => {
//   recording = setupProjectRecording({
//     directory: __dirname,
//     name: 'fetch-finding-alerts',
//   });

//   const stepConfig = buildStepTestConfigForStep(Steps.FINDING_ALERTS);
//   const stepResult = await executeStepWithDependencies(stepConfig);
//   expect(0).toEqual(0);
//   //expect(stepResult).toMatchStepMetadata(stepConfig);
// });
