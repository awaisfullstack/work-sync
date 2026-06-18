'use strict';

const taskStatuses = [
  {
    id: '40000000-0000-4000-8000-000000000001',
    name: 'TODO',
  },
  {
    id: '40000000-0000-4000-8000-000000000002',
    name: 'IN_PROGRESS',
  },
  {
    id: '40000000-0000-4000-8000-000000000003',
    name: 'COMPLETED',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'task_statuses',
      taskStatuses.map((status) => ({
        id: status.id,
        name: status.name,
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
      id: {
        [Sequelize.Op.in]: taskStatuses.map((status) => status.id),
      },
    });
  },
};
