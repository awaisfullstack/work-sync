'use strict';

const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'task_statuses',
      taskStatuses.map((name) => ({
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
    await queryInterface.bulkDelete('task_statuses', {
      name: {
        [Sequelize.Op.in]: taskStatuses,
      },
    });
  },
};
