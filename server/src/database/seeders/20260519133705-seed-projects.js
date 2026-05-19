'use strict';

const { randomUUID } = require('crypto');

const projectTitles = [
  'WorkSync Backend API',
  'WorkSync Frontend Dashboard',
  'Task Management System',
  'Shift Tracking System',
  'Employee Attendance Portal',
  'Project Analytics Dashboard',
  'Role Based Access Control',
  'Notification Service',
  'Internal HR Portal',
  'Payroll Integration System',
  'Client Project Tracker',
  'Team Collaboration Workspace',
  'Sprint Planning Board',
  'Employee Performance Reports',
  'Department Reporting System',
  'Audit Activity Tracker',
  'Company Resource Planner',
  'Leave Management System',
  'Admin Control Panel',
  'Work Hours Analytics',
  'Mobile API Gateway',
  'Frontend Error Logger',
  'Machine Timezone API',
  'Project Member Management',
  'Dashboard Statistics Service',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const admins = await queryInterface.sequelize.query(
      `
      SELECT id
      FROM users
      WHERE role = 'ADMIN'
      ORDER BY created_at ASC
      LIMIT 1;
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    if (!admins.length) {
      throw new Error('No ADMIN user found. Please run users seeder first.');
    }

    const adminId = admins[0].id;

    const projects = projectTitles.map((title, index) => {
      const statuses = ['ACTIVE', 'COMPLETED', 'ARCHIVED'];
      const status =
        index < 18 ? 'ACTIVE' : index < 22 ? 'COMPLETED' : 'ARCHIVED';

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 15 + index * 3);

      return {
        id: randomUUID(),
        title,
        description: `${title} for WorkSync internal team task and shift management platform.`,
        status,
        deadline,
        created_by_id: adminId,
        archived_at: status === 'ARCHIVED' ? now : null,
        created_at: now,
        updated_at: now,
      };
    });

    await queryInterface.bulkInsert('projects', projects);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', {
      title: projectTitles,
    });
  },
};
