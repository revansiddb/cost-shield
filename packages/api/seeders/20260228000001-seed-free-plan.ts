import { QueryInterface, DataTypes } from 'sequelize';
import crypto from 'crypto';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Generate an explicit UUID so we can easily connect it later if needed in a local dev test, but otherwise it acts like a normal PK
    await queryInterface.bulkInsert('plans', [
      {
        id: crypto.randomUUID(),
        name: 'Free',
        description: 'Starter limits for application testing and validation.',
        amount: 0,
        currency_code: 'USD',
        billing_interval: 'monthly',
        request_limit: 10000,   // Reasonable generous free ceiling
        project_limit: 1,       // PRD explicit v1 constraint single project
        stripe_price_id: null,
        razorpay_plan_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('plans', {
      name: 'Free'
    });
  }
};
