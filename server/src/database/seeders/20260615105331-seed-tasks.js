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
