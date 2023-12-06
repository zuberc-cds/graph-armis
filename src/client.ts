import fetch, { RequestInit, Response as NodeFetchResponse } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationLogger,
  IntegrationError,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import {
  ArmisAlert,
  ArmisDevice,
  ArmisDeviceVulnerability,
  ArmisSite,
  ArmisUser,
  ArmisVulnerability,
} from './types';

// eslint-disable-next-line no-unused-vars
export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

type responseData = {
  data: {
    count: number;
    next: number;
    prev: number;
    total: number;
    results?: Array<any>;
    sample?: Array<any>;
    sites?: Array<any>;
  };
  success: boolean;
};

type userResponseData = {
  data: {
    users: Array<any>;
  };
  success: boolean;
};

export interface ProviderResponse<T> extends NodeFetchResponse {
  json(): Promise<T>;
  status: number;
  statusText: string;
  ok: boolean;
}

export enum Method {
  // eslint-disable-next-line no-unused-vars
  GET = 'get',
  // eslint-disable-next-line no-unused-vars
  POST = 'post',
}

const ITEMS_PER_PAGE = 200;

export class APIClient {
  authToken: string;
  logger: IntegrationLogger;
  BASE_URL = '';

  constructor(public config: IntegrationConfig) {
    this.BASE_URL = 'https://' + config.host;
  }

  public setLogger(logger: IntegrationLogger) {
    this.logger = logger;
  }

  public setAuthToken(token: string) {
    this.authToken = token;
  }

  public getAuthToken() {
    return this.authToken;
  }

  private async request<T>(
    endpoint: string,
    method: Method,
    body?: {},
  ): Promise<ProviderResponse<T>> {
    /* eslint-disable no-console */
    const requestAttempt = async () => {
      // Check rate limit status before each request
      // await this.checkRateLimitStatus(); // Use j1-rate-limit snippet to generate this function
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthToken(),
        },
        port: 443,
      };
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      const absoluteURL = this.BASE_URL + endpoint;

      const response: ProviderResponse<T> = (await fetch(
        absoluteURL,
        requestOptions,
      )) as ProviderResponse<T>;
      if (response.status === 401) {
        await this.verifyAuthentication();
        throw new RetryableError();
      } else if (response.status === 403) {
        throw new IntegrationProviderAuthorizationError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      } else if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint: absoluteURL,
          status: response.status,
          statusText: response.statusText,
        });
      } else if (response.status === 200) {
        // Set a new rate limit status after each successful request
        // this.setRateLimitStatus(response); // Use j1-rate-limit snippet to generate this function
      }

      return response;
    };

    return await retry(requestAttempt, {
      // The maximum number of attempts or 0 if there is no limit on number of attempts.
      maxAttempts: 3,
      // The delay between each attempt in milliseconds. You can provide a factor to have the delay grow exponentially.
      delay: 30_000,
      // A timeout in milliseconds. If timeout is non-zero then a timer is set using setTimeout.
      // If the timeout is triggered then future attempts will be aborted.
      timeout: 180_000,
      // The factor option is used to grow the delay exponentially.
      // For example, a value of 2 will cause the delay to double each time
      factor: 2,
      handleError: (error, attemptContext) => {
        if ([401, 403, 404].includes(error.status)) {
          if (!error.retryable) {
            attemptContext.abort();
          }
        }

        if (attemptContext.aborted) {
          this.logger.info(
            { attemptContext, error, endpoint },
            'Hit an unrecoverable error from API Provider. Aborting.',
          );
        } else {
          this.logger.info(
            { attemptContext, error, endpoint },
            `Hit a possibly recoverable error from API Provider. Waiting before trying again.`,
          );
        }
      },
    });
    /* eslint-enable no-console */
  }

  public async verifyAuthentication(): Promise<void | string> {
    /* eslint-disable no-console */
    const endpoint = '/api/v1/access_token/';

    const response = await this.request(endpoint, Method.POST, {
      secret_key: this.config.apiKey,
    });

    const result: any = await response.json();

    if (!result.data.access_token) {
      throw new IntegrationProviderAuthenticationError({
        cause: new Error('Invalid access token' + this.config.host),
        endpoint: this.config.host + endpoint,
        status: response.status,
        statusText: response.statusText,
      });
    } else {
      this.authToken = result.data.access_token;
      return this.authToken;
    }
    /* eslint-enable no-console */
  }

  /**
   * Iterates each device resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDevices(
    iteratee: ResourceIteratee<ArmisDevice>,
  ): Promise<void> {
    await sleep(10);
    return await this.iterateEntities(
      iteratee,
      'devices',
      this.getSearchEndpoint('in:devices'),
    );
  }

  /**
   * Iterates each alert resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateAlerts(
    iteratee: ResourceIteratee<ArmisAlert>,
  ): Promise<void> {
    await sleep(10);
    return await this.iterateEntities(
      iteratee,
      'alerts',
      this.getSearchEndpoint('in:alerts'),
    );
  }

  /**
   * Iterates each vulnerability resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateVulnerabilities(
    iteratee: ResourceIteratee<ArmisVulnerability>,
  ): Promise<void> {
    await sleep(10);
    return await this.iterateEntities(
      iteratee,
      'vulnerabilities',
      this.getSearchEndpoint('in:vulnerabilities'),
    );
  }

  /**
   * Iterates each vulnerability resource in the provider.
   *
   * @param deviceId the id of the device
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDeviceVulnerabilities(
    deviceId: string,
    iteratee: ResourceIteratee<ArmisDeviceVulnerability>,
  ): Promise<void> {
    await sleep(10);
    return await this.iterateEntities(
      iteratee,
      'device vulnerabilities matches',
      '/api/v1/vulnerability-match/?device_ids=' + encodeURIComponent(deviceId),
      'sample',
    );
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<ArmisUser>,
  ): Promise<void> {
    await sleep(10);
    const response: ProviderResponse<userResponseData> = await this.request(
      '/api/v1/users/',
      Method.GET,
    );
    const result: userResponseData = await response.json();
    if (Array.isArray(result.data.users)) {
      for (const entity of result.data.users) {
        await iteratee(entity);
      }
      this.logger.info('users fetched successfully');
    } else {
      throw new IntegrationError({
        code: 'UNEXPECTED_RESPONSE_DATA',
        message: `Expected a collection of resources but type was ${typeof result}`,
      });
    }
  }

  /**
   * Iterates each site resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateSites(
    iteratee: ResourceIteratee<ArmisSite>,
  ): Promise<void> {
    await sleep(10);
    return await this.iterateEntities(
      iteratee,
      'sites',
      '/api/v1/sites/?',
      'sites',
    );
  }

  /**
   * Iterates each entity in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateEntities(
    iteratee: ResourceIteratee<any>,
    entity: string,
    endpoint: string,
    results_key: string = 'results',
  ): Promise<void> {
    let from = 0,
      totalCount = 0;

    do {
      const response: ProviderResponse<responseData> = await this.request(
        `${endpoint}from=${from}&length=${ITEMS_PER_PAGE}`,
        Method.GET,
      );
      const result: responseData = await response.json();

      // Get total count via response
      totalCount = result.data.total;

      if (Array.isArray(result.data[results_key])) {
        for (const entity of result.data[results_key]) {
          await iteratee(entity);
        }
        this.logger.info(`${entity} fetched successfully`);
      } else {
        throw new IntegrationError({
          code: 'UNEXPECTED_RESPONSE_DATA',
          message: `Expected a collection of resources but type was ${typeof result}`,
        });
      }

      // Increase current index
      from = from + ITEMS_PER_PAGE;
    } while (from <= totalCount);
  }

  private getSearchEndpoint(aql: string) {
    return `/api/v1/search/?aql=${encodeURIComponent(
      aql + ' timeFrame:"' + this.config.timeFrame + ' Days"',
    )}&`;
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger?: IntegrationLogger,
): APIClient {
  const apiClient = new APIClient(config);
  if (logger) apiClient.setLogger(logger);
  return apiClient;
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class RetryableError extends Error {
  retryable = true;
}
