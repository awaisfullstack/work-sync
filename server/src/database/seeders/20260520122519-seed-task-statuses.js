'use strict';

const now = new Date();
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
    await queryInterface.bulkInsert(
      'task_statuses',
      [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'TODO',
          created_at: now,
          updated_at: now,
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'IN_PROGRESS',
          created_at: now,
          updated_at: now,
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'COMPLETED',
          created_at: now,
          updated_at: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('task_statuses', {
      id: [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
      ],
    });
  },
};
