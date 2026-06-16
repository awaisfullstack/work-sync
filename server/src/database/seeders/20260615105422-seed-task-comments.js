'use strict';

const taskComments = [
  {
    id: '52000000-0000-4000-8000-000000000001',
    task_id: '50000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000006',
    comment: 'Start with access and refresh token endpoints, then wire guards.',
  },
  {
    id: '52000000-0000-4000-8000-000000000002',
    task_id: '50000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000006',
    comment: 'I will prepare the auth module structure and DTO validation.',
  },
  {
    id: '52000000-0000-4000-8000-000000000003',
    task_id: '50000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000008',
    comment: 'Keep the project filters aligned with the dashboard tables.',
  },
  {
    id: '52000000-0000-4000-8000-000000000004',
    task_id: '50000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000008',
    comment:
      'I will verify the frontend payload shape against the API response.',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const values = taskComments.map((taskComment) => ({
      id: taskComment.id,
      task_id: taskComment.task_id,
      user_id: taskComment.user_id,
      comment: taskComment.comment,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('task_comments', {
      id: {
        [Sequelize.Op.in]: taskComments.map((taskComment) => taskComment.id),
      },
    });

    await queryInterface.bulkInsert('task_comments', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('task_comments', {
      id: {
        [Sequelize.Op.in]: taskComments.map((taskComment) => taskComment.id),
      },
    });
  },
};
