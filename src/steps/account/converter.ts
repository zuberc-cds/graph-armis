import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: 'armis-account-1',
        name: 'Example Co. Armis Account',
      },
      assign: {
        _key: 'armis-account-1',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/Account.json
      },
    },
  });
}
