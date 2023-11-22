import https from 'https';

import {
  IntegrationLogger,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { AcmeUser, AcmeGroup, ArmisDevice, ArmisSite } from './types';

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
    const request = new Promise<void>((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path: '/api/v1/access_token/',
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
        endpoint:
          'https://integration-crestdata.armis.com/api/v1/some/access_token',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateDevices(
    iteratee: ResourceIteratee<ArmisDevice>,
  ): Promise<void> {
    const request = new Promise<void>((resolve, reject) => {
      this.logger.info(
        '/api/v1/search/?aql=' +
          encodeURIComponent('in:devices timeFrame:"20 Days"'),
      );
      const results: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path:
            '/api/v1/search/?aql=' +
            encodeURIComponent('in:devices timeFrame:"20 Days"'),
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
              for (const device of res.data.results) {
                void iteratee(device);
              }
              resolve();
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
      /*throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint:
          'https://integration-crestdata.armis.com/api/v1/some/access_token',
        status: err.status,
        statusText: err.statusText,
      });*/
    }
  }

  public async iterateSites(
    iteratee: ResourceIteratee<ArmisSite>,
  ): Promise<void> {
    const request = new Promise<void>((resolve, reject) => {
      this.logger.info('/api/v1/sites/?');
      const results: any = [];
      const req = https.request(
        {
          hostname: 'integration-crestdata.armis.com',
          port: 443,
          path: '/api/v1/sites/?',
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
              this.logger.info('Sites fetched successfully');
              const res = JSON.parse(Buffer.concat(results).toString());
              for (const site of res.data.sites) {
                void iteratee(site);
              }
              resolve();
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
        endpoint: 'https://integration-crestdata.armis.com/api/v1/sites/',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<AcmeUser>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const users: AcmeUser[] = [
      {
        id: 'acme-user-1',
        name: 'User One',
      },
      {
        id: 'acme-user-2',
        name: 'User Two',
      },
    ];

    for (const user of users) {
      await iteratee(user);
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
