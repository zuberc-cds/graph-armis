// Providers often supply types with their API libraries.

export interface AcmeUser {
  id: string;
  name: string;
}

export interface AcmeGroup {
  id: string;
  name: string;
  users?: Pick<AcmeUser, 'id'>[];
}

export interface ArmisDevice {
  id: number;
  name: string;
  category: string;
  type: string;
  model: string;
  manufacturer: string;
  operatingSystem: string;
  operatingSystemVersion: string;
  lastSeen: string;
}

export interface ArmisSite {
  id: number;
  lat: number;
  lng: number;
  location: string;
  name: string;
  parentId: string;
}

export interface ArmisAlert extends ArmisFinding {
  alertId: number;
  title: string;
  classification: string;
  type: string;
  policyId: number;
  policyTitle: string;
  time: string;
  deviceIds: number[];
}

export interface ArmisVulnerability extends ArmisFinding {
  cveUid: string;
  affectedDevicesCount: number;
  attackComplexity: string;
  attackVector: string;
  availabilityImpact: string;
  cvssScore: number;
  epssPercentile: number;
  epssScore: number;
  exploitabilityScore: number;
  impactScore: number;
  integrityImpact: string;
  publishedDate: string;
  score: number;
  commonName: string;
  threatTags: string[];
}

export interface ArmisFinding {
  id: string;
  description: string;
  severity: string;
  status: string;
}

export type ArmisDeviceVulnerability = {
  cveUid: string;
};

// Those can be useful to a degree, but often they're just full of optional
// values. Understanding the response data may be more reliably accomplished by
// reviewing the API response recordings produced by testing the wrapper client
// (./client.ts). However, when there are no types provided, it is necessary to define
// opaque types for each resource, to communicate the records that are expected
// to come from an endpoint and are provided to iterating functions.

/*
import { Opaque } from 'type-fest';
export type AcmeUser = Opaque<any, 'AcmeUser'>;
export type AcmeGroup = Opaque<any, 'AcmeGroup'>;
*/
