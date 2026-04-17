import { Polar } from '@polar-sh/sdk';

const polar = new Polar({ accessToken: 'test' });
polar.checkouts.create({
  products: ['test'],
  successUrl: 'test',
  customerEmail: 'test',
  metadata: { userId: '123' }
});
