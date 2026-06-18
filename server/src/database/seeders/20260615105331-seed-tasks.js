'use strict';

const tasks = [
  {
    id: '50000000-0000-4000-8000-000000000001',
    title: 'Implement JWT authentication',
    description: 'Build access token and refresh token flow.',
    project_id: '30000000-0000-4000-8000-000000000001',
    status_id: '40000000-0000-4000-8000-000000000001',
    due_date: '2026-07-10',
    created_by_id: '20000000-0000-4000-8000-000000000001',
  },
  {
    id: '50000000-0000-4000-8000-000000000002',
    title: 'Create Projects API',
    description: 'Develop CRUD endpoints for projects module.',
    status_id: '40000000-0000-4000-8000-000000000001',
    project_id: '30000000-0000-4000-8000-000000000002',
    due_date: '2026-07-18',
    created_by_id: '20000000-0000-4000-8000-000000000001',
  },
  {
    id: '50000000-0000-4000-8000-000000000003',
    title: 'Build task status workflow',
    description: 'Add status transitions and validation for task updates.',
    status_id: '40000000-0000-4000-8000-000000000002',
    project_id: '30000000-0000-4000-8000-000000000001',
    due_date: '2026-07-12',
    created_by_id: '20000000-0000-4000-8000-000000000002',
  },
  {
    id: '50000000-0000-4000-8000-000000000004',
    title: 'Design dashboard task filters',
    description: 'Create filter controls for status, assignee, and due date.',
    status_id: '40000000-0000-4000-8000-000000000001',
    project_id: '30000000-0000-4000-8000-000000000002',
    due_date: '2026-07-20',
    created_by_id: '20000000-0000-4000-8000-000000000001',
  },
  {
    id: '50000000-0000-4000-8000-000000000005',
    title: 'Add task comments endpoint',
    description: 'Implement create, list, and delete endpoints for comments.',
    status_id: '40000000-0000-4000-8000-000000000002',
    project_id: '30000000-0000-4000-8000-000000000001',
    due_date: '2026-07-14',
    created_by_id: '20000000-0000-4000-8000-000000000002',
  },
  {
    id: '50000000-0000-4000-8000-000000000006',
    title: 'Prepare employee profile page',
    description: 'Show user details, department, active tasks, and shift state.',
    status_id: '40000000-0000-4000-8000-000000000001',
    project_id: '30000000-0000-4000-8000-000000000003',
    due_date: '2026-07-22',
    created_by_id: '20000000-0000-4000-8000-000000000003',
  },
  {
    id: '50000000-0000-4000-8000-000000000007',
    title: 'Create QA smoke test checklist',
    description: 'Document smoke test coverage for auth, projects, and tasks.',
    status_id: '40000000-0000-4000-8000-000000000003',
    project_id: '30000000-0000-4000-8000-000000000004',
    due_date: '2026-06-28',
    created_by_id: '20000000-0000-4000-8000-000000000003',
  },
  {
    id: '50000000-0000-4000-8000-000000000008',
    title: 'Implement shift summary widget',
    description: 'Display active shifts and weekly hour totals on dashboard.',
    status_id: '40000000-0000-4000-8000-000000000002',
    project_id: '30000000-0000-4000-8000-000000000005',
    due_date: '2026-06-25',
    created_by_id: '20000000-0000-4000-8000-000000000002',
  },
  {
    id: '50000000-0000-4000-8000-000000000009',
    title: 'Add activity log timeline',
    description: 'Build backend query support for recent project activity.',
    status_id: '40000000-0000-4000-8000-000000000001',
    project_id: '30000000-0000-4000-8000-000000000005',
    due_date: '2026-07-05',
    created_by_id: '20000000-0000-4000-8000-000000000001',
  },
  {
    id: '50000000-0000-4000-8000-000000000010',
    title: 'Review project member permissions',
    description:
      'Verify role-based access for project members and admin actions.',
    status_id: '40000000-0000-4000-8000-000000000003',
    project_id: '30000000-0000-4000-8000-000000000004',
    due_date: '2026-06-30',
    created_by_id: '20000000-0000-4000-8000-000000000004',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const values = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      created_by_id: task.created_by_id,
      project_id: task.project_id,
      status_id: task.status_id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('tasks', {
      id: {
        [Sequelize.Op.in]: tasks.map((task) => task.id),
      },
    });

    await queryInterface.bulkInsert('tasks', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', {
      id: {
        [Sequelize.Op.in]: tasks.map((task) => task.id),
      },
    });
  },
};
