'use strict';

const taskComments = [
  {
    id: '52000000-0000-4000-8000-000000000001',
    task_id: '50000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000016',
    comment: 'Start with access and refresh token endpoints, then wire guards.',
  },
  {
    id: '52000000-0000-4000-8000-000000000002',
    task_id: '50000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000017',
    comment: 'I will prepare the auth module structure and DTO validation.',
  },
  {
    id: '52000000-0000-4000-8000-000000000003',
    task_id: '50000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000018',
    comment: 'Keep the project filters aligned with the dashboard tables.',
  },
  {
    id: '52000000-0000-4000-8000-000000000004',
    task_id: '50000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000019',
    comment:
      'I will verify the frontend payload shape against the API response.',
  },
  {
    id: '52000000-0000-4000-8000-000000000005',
    task_id: '50000000-0000-4000-8000-000000000003',
    user_id: '20000000-0000-4000-8000-000000000022',
    comment: 'Status transitions should reject moving completed tasks backward.',
  },
  {
    id: '52000000-0000-4000-8000-000000000006',
    task_id: '50000000-0000-4000-8000-000000000003',
    user_id: '20000000-0000-4000-8000-000000000016',
    comment: 'I added notes for TODO to IN_PROGRESS validation cases.',
  },
  {
    id: '52000000-0000-4000-8000-000000000007',
    task_id: '50000000-0000-4000-8000-000000000004',
    user_id: '20000000-0000-4000-8000-000000000018',
    comment: 'The dashboard filters should persist when the page refreshes.',
  },
  {
    id: '52000000-0000-4000-8000-000000000008',
    task_id: '50000000-0000-4000-8000-000000000005',
    user_id: '20000000-0000-4000-8000-000000000017',
    comment: 'Comment deletion needs to be limited to owners and admins.',
  },
  {
    id: '52000000-0000-4000-8000-000000000009',
    task_id: '50000000-0000-4000-8000-000000000006',
    user_id: '20000000-0000-4000-8000-000000000006',
    comment: 'Profile page should include active shift state near the header.',
  },
  {
    id: '52000000-0000-4000-8000-000000000010',
    task_id: '50000000-0000-4000-8000-000000000006',
    user_id: '20000000-0000-4000-8000-000000000007',
    comment: 'I can prepare the employee detail mock data for frontend testing.',
  },
  {
    id: '52000000-0000-4000-8000-000000000011',
    task_id: '50000000-0000-4000-8000-000000000007',
    user_id: '20000000-0000-4000-8000-000000000012',
    comment: 'Smoke checks are ready for auth and project member flows.',
  },
  {
    id: '52000000-0000-4000-8000-000000000012',
    task_id: '50000000-0000-4000-8000-000000000008',
    user_id: '20000000-0000-4000-8000-000000000020',
    comment: 'Weekly hour totals should group by user and local work date.',
  },
  {
    id: '52000000-0000-4000-8000-000000000013',
    task_id: '50000000-0000-4000-8000-000000000009',
    user_id: '20000000-0000-4000-8000-000000000021',
    comment: 'Recent activity should show task updates before shift events.',
  },
  {
    id: '52000000-0000-4000-8000-000000000014',
    task_id: '50000000-0000-4000-8000-000000000010',
    user_id: '20000000-0000-4000-8000-000000000013',
    comment: 'Permission review is complete for member removal cases.',
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
