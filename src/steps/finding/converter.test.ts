import { ArmisAlert, ArmisVulnerability } from '../../types';
import {
  createAlertFindingEntity,
  createVulnerabilityFindingEntity,
} from './converter';

describe('#createAlertFindingEntity', () => {
  test('should convert to alert entity', () => {
    const alertEntity: ArmisAlert = {
      alertId: 219,
      status: 'Unhandled',
      description:
        'When data is sent encrypted on the network, it dramatically reduces the impact of that data being intercepted by someone that should not have it. Not all data needs to be encrypted, especially when that data is traversing an internal network. Unencrypted protocols can be potentially intercepted resulting in sensitive company information being stolen.',
      classification: 'Security - Other',
      deviceIds: [133],
      policyId: 110807,
      policyTitle: '[Risk] Unencrypted Traffic in Use',
      severity: 'Medium',
      time: '2023-11-26T19:06:58.601691+00:00',
      title: '[Risk] Unencrypted Traffic in Use',
      type: 'System Policy Violation',
    };
    expect(createAlertFindingEntity(alertEntity)).toMatchSnapshot();
  });

  test('should convert to vulnerability entity', () => {
    const vulnerabilityEntity: ArmisVulnerability = {
      affectedDevicesCount: 3,
      attackComplexity: 'Low',
      attackVector: 'Network',
      availabilityImpact: 'High',
      commonName: null,
      cveUid: 'CVE-2022-32845',
      cvssScore: 10,
      description:
        'This issue was addressed with improved checks. This issue is fixed in watchOS 8.7, iOS 15.6 and iPadOS 15.6, macOS Monterey 12.5. An app may be able to break out of its sandbox.',
      epssPercentile: 0.53,
      epssScore: 0.00166,
      exploitabilityScore: 3.9,
      id: 'CVE-2022-32845',
      impactScore: 6,
      integrityImpact: 'High',
      publishedDate: '2022-09-23T19:15:00+00:00',
      score: 10,
      severity: 'Critical',
      status: 'Open',
      threatTags: null,
    };
    expect(
      createVulnerabilityFindingEntity(vulnerabilityEntity),
    ).toMatchSnapshot();
  });
});
