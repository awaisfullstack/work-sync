'use strict';

const taskAssignments = [
  {
    task_title: 'Implement JWT authentication',
    user_email: 'taha.siddiqui@worksync.com',
    assigned_by_email: 'admin@worksync.com',
  },
  {
    task_title: 'Implement JWT authentication',
    user_email: 'imran.qureshi@worksync.com',
    assigned_by_email: 'admin@worksync.com',
  },
  {
    task_title: 'Create Projects API',
    user_email: 'maryam.iqbal@worksync.com',
    assigned_by_email: 'admin@worksync.com',
  },
  {
    task_title: 'Create Projects API',
    user_email: 'laiba.hassan@worksync.com',
    assigned_by_email: 'admin@worksync.com',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const requiredTaskTitles = [
      ...new Set(taskAssignments.map((assignment) => assignment.task_title)),
    ];
    const requiredUserEmails = [
      ...new Set(
        taskAssignments.flatMap((assignment) => [
          assignment.user_email,
          assignment.assigned_by_email,
        ]),
      ),
    ];

    const taskRows = await queryInterface.sequelize.query(
      `
      SELECT id, title
      FROM tasks
      WHERE title IN (:titles)
      `,
      {
        replacements: { titles: requiredTaskTitles },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const userRows = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE email IN (:emails)
      `,
      {
        replacements: { emails: requiredUserEmails },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const taskByTitle = new Map(taskRows.map((task) => [task.title, task.id]));
    const userByEmail = new Map(userRows.map((user) => [user.email, user.id]));

    const missingTasks = requiredTaskTitles.filter(
      (title) => !taskByTitle.has(title),
    );
    const missingUsers = requiredUserEmails.filter(
      (email) => !userByEmail.has(email),
    );

    if (missingTasks.length > 0) {
      throw new Error(`Required tasks not found: ${missingTasks.join(', ')}`);
    }

    if (missingUsers.length > 0) {
      throw new Error(`Required users not found: ${missingUsers.join(', ')}`);
    }

    const now = new Date();
    const values = taskAssignments.map((assignment) => ({
      task_id: taskByTitle.get(assignment.task_title),
      user_id: userByEmail.get(assignment.user_email),
      assigned_by: userByEmail.get(assignment.assigned_by_email),
      assigned_at: now,
      unassigned_at: null,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('task_assignments', {
      [Sequelize.Op.or]: values.map((assignment) => ({
        task_id: assignment.task_id,
        user_id: assignment.user_id,
      })),
    });

    await queryInterface.bulkInsert('task_assignments', values);
  },

  async down(queryInterface, Sequelize) {
    const requiredTaskTitles = [
      ...new Set(taskAssignments.map((assignment) => assignment.task_title)),
    ];
    const requiredUserEmails = [
      ...new Set(taskAssignments.map((assignment) => assignment.user_email)),
    ];

    const taskRows = await queryInterface.sequelize.query(
      `
      SELECT id, title
      FROM tasks
      WHERE title IN (:titles)
      `,
      {
        replacements: { titles: requiredTaskTitles },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const userRows = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE email IN (:emails)
      `,
      {
        replacements: { emails: requiredUserEmails },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const taskByTitle = new Map(taskRows.map((task) => [task.title, task.id]));
    const userByEmail = new Map(userRows.map((user) => [user.email, user.id]));
    const deletePairs = taskAssignments
      .map((assignment) => ({
        task_id: taskByTitle.get(assignment.task_title),
        user_id: userByEmail.get(assignment.user_email),
      }))
      .filter((assignment) => assignment.task_id && assignment.user_id);

    if (deletePairs.length === 0) {
      return;
    }

    await queryInterface.bulkDelete('task_assignments', {
      [Sequelize.Op.or]: deletePairs,
    });
  },
};
