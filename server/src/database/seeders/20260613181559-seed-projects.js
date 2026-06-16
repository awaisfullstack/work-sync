'use strict';

const projects = [
  {
    id: '30000000-0000-4000-8000-000000000001',
    title: 'WorkSync Backend API',
    description:
      'Build scalable NestJS backend APIs for authentication, users, projects, tasks, shifts, dashboard, and activity logs.',
    status: 'ACTIVE',
    deadline: '2026-07-10',
    created_by_id: '20000000-0000-4000-8000-000000000001',
  },
  {
    id: '30000000-0000-4000-8000-000000000002',
    title: 'WorkSync Frontend Dashboard',
    description:
      'Build Next.js App Router frontend with authentication, dashboard, RTK Query, filters, and protected routes.',
    status: 'ACTIVE',
    deadline: '2026-07-18',
    created_by_id: '20000000-0000-4000-8000-000000000001',
  },
  {
    id: '30000000-0000-4000-8000-000000000003',
    title: 'Internal HR Portal',
    description:
      'Create internal HR features for employee department reporting and user management.',
    status: 'COMPLETED',
    deadline: '2026-08-01',
    created_by_id: '20000000-0000-4000-8000-000000000002',
  },
  {
    id: '30000000-0000-4000-8000-000000000004',
    title: 'QA Automation Setup',
    description:
      'Prepare testing workflows, QA task tracking, and automation planning for internal projects.',
    status: 'ACTIVE',
    deadline: '2026-07-25',
    created_by_id: '20000000-0000-4000-8000-000000000003',
  },
  {
    id: '30000000-0000-4000-8000-000000000005',
    title: 'Reporting and Analytics Module',
    description:
      'Build dashboard reporting for completed tasks, active projects, weekly hours, and recent activity.',
    status: 'COMPLETED',
    deadline: '2026-06-30',
    created_by_id: '20000000-0000-4000-8000-000000000002',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const values = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      deadline: project.deadline,
      created_by_id: project.created_by_id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('projects', {
      id: {
        [Sequelize.Op.in]: projects.map((project) => project.id),
      },
    });

    await queryInterface.bulkInsert('projects', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', {
      id: {
        [Sequelize.Op.in]: projects.map((project) => project.id),
      },
    });
  },
};
