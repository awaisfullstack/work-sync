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

    const projects = await queryInterface.sequelize.query(
      `
      SELECT id, title
      FROM projects
      WHERE title IN (:projectTitles)
      ORDER BY created_at ASC;
      `,
      {
        replacements: { projectTitles },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    if (projects.length < 25) {
      throw new Error(
        '25 projects not found. Please run projects seeder first.',
      );
    }

    const employees = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE role = 'EMPLOYEE'
      ORDER BY created_at ASC;
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    if (employees.length < 5) {
      throw new Error(
        'At least 5 EMPLOYEE users are required. Please add more employee users first.',
      );
    }

    const rows = [];

    projects.forEach((project, projectIndex) => {
      /**
       * Each project gets 3 to 5 members.
       * This makes project_members realistic.
       */
      const membersCount = 3 + (projectIndex % 3);

      for (let i = 0; i < membersCount; i++) {
        const employeeIndex = (projectIndex + i) % employees.length;
        const employee = employees[employeeIndex];

        rows.push({
          id: randomUUID(),
          project_id: project.id,
          user_id: employee.id,
          role_in_project: i === 0 ? 'LEAD' : 'MEMBER',
          joined_at: now,
          created_at: now,
          updated_at: now,
        });
      }
    });

    await queryInterface.bulkInsert('project_members', rows);
  },

  async down(queryInterface, Sequelize) {
    const projects = await queryInterface.sequelize.query(
      `
      SELECT id
      FROM projects
      WHERE title IN (:projectTitles);
      `,
      {
        replacements: { projectTitles },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    const projectIds = projects.map((project) => project.id);

    if (projectIds.length) {
      await queryInterface.bulkDelete('project_members', {
        project_id: projectIds,
      });
    }
  },
};
