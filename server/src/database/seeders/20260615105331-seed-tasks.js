'use strict';

const tasks = [
  {
    title: 'Implement JWT authentication',
    description: 'Build access token and refresh token flow.',
    project: 'WorkSync Backend API',
    status: 'TODO',
    due_date: '2026-07-10',
    created_by_id: 'admin@worksync.com',
  },
  {
    title: 'Create Projects API',
    description: 'Develop CRUD endpoints for projects module.',
    status: 'TODO',
    project: 'WorkSync Frontend Dashboard',
    due_date: '2026-07-18',
    created_by_id: 'admin@worksync.com',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch projects
    const requiredProjects = [...new Set(tasks.map((task) => task.project))];
    const projects = await queryInterface.sequelize.query(
      `
      SELECT id, title
      FROM projects
      WHERE title IN (:titles)
      `,
      {
        replacements: { titles: requiredProjects },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    // Fetch users
    const requiredAdminEmails = [
      ...new Set(tasks.map((task) => task.created_by_id)),
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

    // Fetch statuses
    const requiredStatuses = [...new Set(tasks.map((task) => task.status))];
    const statuses = await queryInterface.sequelize.query(
      `
      SELECT id, name
      FROM task_statuses
      WHERE name IN (:names)
      `,
      {
        replacements: { names: requiredStatuses },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const adminByEmail = new Map(
      adminRows.map((user) => [user.email, user.id]),
    );
    const taskStatusesByName = new Map(
      statuses.map((status) => [status.name, status.id]),
    );
    const projectsByTitle = new Map(
      projects.map((project) => [project.title, project.id]),
    );

    const missingAdmins = requiredAdminEmails.filter(
      (email) => !adminByEmail.has(email),
    );
    const missingProjects = requiredProjects.filter(
      (title) => !projectsByTitle.has(title),
    );
    const missingStatuses = requiredStatuses.filter(
      (name) => !taskStatusesByName.has(name),
    );

    if (missingAdmins.length > 0) {
      throw new Error(
        `Required admin users not found: ${missingAdmins.join(', ')}`,
      );
    }

    if (missingProjects.length > 0) {
      throw new Error(
        `Required projects not found: ${missingProjects.join(', ')}`,
      );
    }

    if (missingStatuses.length > 0) {
      throw new Error(
        `Required task statuses not found: ${missingStatuses.join(', ')}`,
      );
    }

    const now = new Date();

    const values = tasks.map((task) => ({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      created_by_id: adminByEmail.get(task.created_by_id),
      project_id: projectsByTitle.get(task.project),
      status_id: taskStatusesByName.get(task.status),
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('tasks', {
      title: {
        [Sequelize.Op.in]: tasks.map((task) => task.title),
      },
    });

    await queryInterface.bulkInsert('tasks', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', {
      title: {
        [Sequelize.Op.in]: tasks.map((task) => task.title),
      },
    });
  },
};
