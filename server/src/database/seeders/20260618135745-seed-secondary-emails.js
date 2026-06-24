'use strict';

const updates = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    secondary_emails: ['admin.personal@gmail.com', 'admin.backup@gmail.com'],
  },
  {
    id: '20000000-0000-4000-8000-000000000006',
    secondary_emails: ['sara.personal@gmail.com'],
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const user of updates) {
      await queryInterface.bulkUpdate(
        'users',
        {
          secondary_emails: user.secondary_emails,
        },
        {
          id: user.id,
        },
      );
    }
  },

  async down(queryInterface, Sequelize) {
    for (const user of updates) {
      await queryInterface.bulkUpdate(
        'users',
        {
          secondary_emails: [],
        },
        {
          id: user.id,
        },
      );
    }
  },
};
