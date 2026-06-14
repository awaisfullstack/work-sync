'use strict';

const projects = [
  {
    title: 'WorkSync Backend API',
    description:
      'Build scalable NestJS backend APIs for authentication, users, projects, tasks, shifts, dashboard, and activity logs.',
    status: 'ACTIVE',
    deadline: '2026-07-10',
    created_by_id: 'admin@worksync.com',
  },
  {
    title: 'WorkSync Frontend Dashboard',
    description:
      'Build Next.js App Router frontend with authentication, dashboard, RTK Query, filters, and protected routes.',
    status: 'ACTIVE',
    deadline: '2026-07-18',
    created_by_id: 'admin@worksync.com',
  },
  {
    title: 'Internal HR Portal',
    description:
      'Create internal HR features for employee department reporting and user management.',
    status: 'COMPLETED',
    deadline: '2026-08-01',
    created_by_id: 'admin2@worksync.com',
  },
  {
    title: 'QA Automation Setup',
    description:
      'Prepare testing workflows, QA task tracking, and automation planning for internal projects.',
    status: 'ACTIVE',
    deadline: '2026-07-25',
    created_by_id: 'admin3@worksync.com',
  },
  {
    title: 'Reporting and Analytics Module',
    description:
      'Build dashboard reporting for completed tasks, active projects, weekly hours, and recent activity.',
    status: 'COMPLETED',
    deadline: '2026-06-30',
    created_by_id: 'admin2@worksync.com',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const requiredAdminEmails = [
      ...new Set(projects.map((project) => project.created_by_id)),
    ];

    const adminRows = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE email IN (:emails)
      `,
      {
        replacements: { emails: requiredAdminEmails },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const adminByEmail = new Map(
      adminRows.map((user) => [user.email, user.id]),
    );
    const missingAdmins = requiredAdminEmails.filter(
      (email) => !adminByEmail.has(email),
    );

    if (missingAdmins.length > 0) {
      throw new Error(
        `Required admin users not found: ${missingAdmins.join(', ')}`,
      );
    }

    const now = new Date();

    const values = projects.map((project) => ({
      ...project,
      created_by_id: adminByEmail.get(project.created_by_id),
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('projects', {
      title: {
        [Sequelize.Op.in]: projects.map((project) => project.title),
      },
    });

    await queryInterface.bulkInsert('projects', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', {
      title: {
        [Sequelize.Op.in]: projects.map((project) => project.title),
      },
    });
  },
};
