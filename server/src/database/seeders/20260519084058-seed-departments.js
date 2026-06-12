'use strict';

const departments = [
  'Development',
  'Human Resources',
  'Operations',
  'Design',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'departments',
      departments.map((name) => ({
        id: Sequelize.literal('gen_random_uuid()'),
        name,
        created_at: now,
        updated_at: now,
      })),
      {
        ignoreDuplicates: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', {
      name: {
        [Sequelize.Op.in]: departments,
      },
    });
  },
};
