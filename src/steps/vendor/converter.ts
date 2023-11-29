import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createVendorEntity(): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: 'armis-vendor',
        name: 'Armis',
        category: ['security'],
      },
      assign: {
        _key: 'armis-vendor',
        _type: Entities.VENDOR._type,
        _class: Entities.VENDOR._class,
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/Account.json
      },
    },
  });
}
