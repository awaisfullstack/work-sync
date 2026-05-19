'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Development',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Human Resources',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Operations',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Design',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  },
};
