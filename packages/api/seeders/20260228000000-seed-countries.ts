import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkInsert('countries', [
      {
        iso_code: 'IN',
        name: 'India',
        currency_code: 'INR',
        tax_rate: 0.1800, // 18% GST typical
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        iso_code: 'US',
        name: 'United States',
        currency_code: 'USD',
        tax_rate: 0.0000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        iso_code: 'GB',
        name: 'United Kingdom',
        currency_code: 'GBP',
        tax_rate: 0.2000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        iso_code: 'AU',
        name: 'Australia',
        currency_code: 'AUD',
        tax_rate: 0.1000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('countries', {
      iso_code: ['IN', 'US', 'GB', 'AU']
    });
  }
};
