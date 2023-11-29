import https from 'https';

import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  AcmeGroup,
  ArmisDevice,
  ArmisSite,
  ArmisAlert,
  ArmisVulnerability,
  ArmisDeviceVulnerability,
  ArmisUser,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  authToken: string;
  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {}

  public async verifyAuthentication(): Promise<void> {
    // TODO make the most light-weight request possible to validate
    // authentication works with the provided credentials, throw an err if
    // authentication fails
    // TODO take key from config
    const postData = JSON.stringify({
      secret_key: this.config.apiKey,
    });
    const path = '/api/v1/access_token/';
    const request = new Promise<void>((resolve, reject) => {
      const req = https.request(
        {
          hostname: this.config.host,
          port: 443,
          path: path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          res.resume();
          res
            .on('data', (data) => {
              const res = JSON.parse(data);
              if (!res.data.access_token) {
                reject(new Error('Provider authentication failed'));
              }
              this.authToken = res.data.access_token;
              resolve();
            })
            .on('error', () => {
              reject(new Error('Provider authentication failed'));
            });
        },
      );
      req.write(postData);
      req.end();
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateDevices(
    iteratee: ResourceIteratee<ArmisDevice>,
  ): Promise<void> {
    const path =
      '/api/v1/search/?aql=' +
      encodeURIComponent(
        'in:devices timeFrame:"' + this.config.timeFrame + ' Days"',
      ) +
      '&from=0&length=200';
    this.logger.info(path);
    const request = new Promise<void>((resolve, reject) => {
      const resultsD: any = [];
      const req = https.request(
        {
          hostname: this.config.host,
          port: 443,
          path: path,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken,
          },
          method: 'GET',
        },
        (res) => {
          res.resume();
          res
            .on('data', (data) => {
              resultsD.push(data);
            })
            .on('end', () => {
              const res = JSON.parse(Buffer.concat(resultsD).toString());
              try {
                if (!('results' in res.data)) {
                  this.logger.error('Devices not found');
                }
                for (const device of res.data.results) {
                  void iteratee(device);
                }
                this.logger.info('Devices fetched successfully');
                resolve();
              } catch (err) {
                this.logger.error(res);
              }
            })
            .on('error', () => {
              reject(new Error('Provider authentication failed'));
            });
        },
      );
      req.end();
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateSites(
    iteratee: ResourceIteratee<ArmisSite>,
  ): Promise<void> {
    const path = '/api/v1/sites/?';
    this.logger.info(path);
    const request = new Promise<void>((resolve, reject) => {
      const results: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path: '/api/v1/sites/?length=100',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken,
          },
          method: 'GET',
        },
        (res) => {
          res.resume();
          res
            .on('data', (data) => {
              results.push(data);
            })
            .on('end', () => {
              const res = JSON.parse(Buffer.concat(results).toString());
              try {
                if (!('sites' in res.data)) {
                  this.logger.error('Sites not found');
                }
                for (const site of res.data.sites) {
                  void iteratee(site);
                }
                this.logger.info('Sites fetched successfully');
                resolve();
              } catch (err) {
                this.logger.error(res);
              }
            })
            .on('error', () => {
              reject(new Error('Provider authentication failed'));
            });
        },
      );
      req.end();
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateAlerts(
    iteratee: ResourceIteratee<ArmisAlert>,
  ): Promise<void> {
    const path =
      '/api/v1/search/?aql=' +
      encodeURIComponent(
        'in:alerts timeFrame:"' + this.config.timeFrame + ' Days"',
      ) +
      '&from=0&length=200';
    this.logger.info(path);
    const request = new Promise<void>((resolve, reject) => {
      const results: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken,
          },
          method: 'GET',
        },
        (res) => {
          res.resume();
          res
            .on('data', (data: any) => {
              results.push(data);
            })
            .on('end', () => {
              const res = JSON.parse(Buffer.concat(results).toString());
              try {
                if (!('results' in res.data)) {
                  this.logger.error('Alerts not found');
                }
                for (const alert of res.data.results) {
                  void iteratee(alert);
                }
                this.logger.info('Alerts fetched successfully');
                resolve(res);
              } catch (err) {
                this.logger.error(res);
              }
            })
            .on('error', () => {
              reject(new Error('Error while fetching alerts'));
            });
        },
      );
      req.end();
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateVulnerabilities(
    iteratee: ResourceIteratee<ArmisVulnerability>,
  ): Promise<void> {
    const path =
      '/api/v1/search/?aql=' +
      encodeURIComponent('in:vulnerabilities timeFrame:"23 Days"') +
      '&from=0&length=200';
    this.logger.info(path);
    const request = new Promise<void>((resolve, reject) => {
      const resultsV: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken,
          },
          method: 'GET',
        },
        (res) => {
          res.resume();
          res
            .on('data', (data: any) => {
              resultsV.push(data);
            })
            .on('end', () => {
              const res = JSON.parse(Buffer.concat(resultsV).toString());
              try {
                if (!('results' in res.data)) {
                  this.logger.error('Vulnerabilities not found');
                }
                for (const vulnerability of res.data.results) {
                  void iteratee(vulnerability);
                }
                this.logger.info('Vulnerabilities fetched successfully');
                resolve();
              } catch (err) {
                this.logger.error('===' + res + '====');
              }
            })
            .on('error', () => {
              reject(new Error('Error while fetching vulnerabilities'));
            });
        },
      );
      req.end();
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateDeviceVulnerabilities(
    deviceId: string,
    iteratee: ResourceIteratee<ArmisDeviceVulnerability>,
  ): Promise<void> {
    const path =
      '/api/v1/vulnerability-match/?device_ids=' + encodeURIComponent(deviceId);
    this.logger.info(path);
    const request = new Promise<void>((resolve, reject) => {
      const results: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken,
          },
          method: 'GET',
        },
        (res) => {
          res.resume();
          res
            .on('data', (data: any) => {
              results.push(data);
            })
            .on('end', () => {
              const res = JSON.parse(Buffer.concat(results).toString());
              try {
                if (!('sample' in res.data)) {
                  this.logger.error('Device vulnerability matches not found');
                }
                for (const vulnerability of res.data.sample) {
                  void iteratee(vulnerability);
                }
                this.logger.info(
                  'Device vulnerability matches fetched successfully',
                );
                resolve();
              } catch (err) {
                this.logger.error(res);
              }
            })
            .on('error', () => {
              reject(new Error('Error while fetching device vulnerabilities'));
            });
        },
      );
      req.end();
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateUsers(
    iteratee: ResourceIteratee<ArmisUser>,
  ): Promise<void> {
    const path = '/api/v1/users/?length=10';
    const request = new Promise<void>((resolve, reject) => {
      this.logger.info(path);
      const results: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken,
          },
          method: 'GET',
        },
        (res) => {
          res.resume();
          res
            .on('data', (data) => {
              results.push(data);
            })
            .on('end', () => {
              const res = JSON.parse(Buffer.concat(results).toString());

              try {
                if (!('users' in res.data)) {
                  this.logger.error('Users not found');
                }
                for (const user of res.data.users) {
                  void iteratee(user);
                }
                this.logger.info('Users fetched successfully');
                resolve(res);
              } catch (err) {
                this.logger.error(res);
              }
            })
            .on('error', () => {
              reject(new Error('Provider authentication failed'));
            });
        },
      );
      req.end();
    });

    try {
      await request;
    } catch (err) {
      this.logger.error(err);
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.config.apiHost + path,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<AcmeGroup>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const groups: AcmeGroup[] = [
      {
        id: 'acme-group-1',
        name: 'Group One',
        users: [
          {
            id: 'acme-user-1',
          },
        ],
      },
    ];

    for (const group of groups) {
      await iteratee(group);
    }
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
