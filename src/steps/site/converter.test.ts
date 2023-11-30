import { ArmisSite } from '../../types';
import { createSiteEntity } from './converter';

describe('#createSiteEntity', () => {
  test('should convert to site entity', () => {
    const siteEntity: ArmisSite = {
      id: 1,
      lat: 37.09024,
      lng: -95.712891,
      location: 'USA',
      name: 'USA Health',
    };
    expect(createSiteEntity(siteEntity)).toMatchSnapshot();
  });
});
