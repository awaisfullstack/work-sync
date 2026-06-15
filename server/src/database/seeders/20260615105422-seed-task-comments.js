'use strict';

const taskComments = [
  {
    task_title: 'Implement JWT authentication',
    user_email: 'admin@worksync.com',
    comment: 'Start with access and refresh token endpoints, then wire guards.',
  },
  {
    task_title: 'Implement JWT authentication',
    user_email: 'imran.qureshi@worksync.com',
    comment: 'I will prepare the auth module structure and DTO validation.',
  },
  {
    task_title: 'Create Projects API',
    user_email: 'admin@worksync.com',
    comment: 'Keep the project filters aligned with the dashboard tables.',
  },
  {
    task_title: 'Create Projects API',
    user_email: 'maryam.iqbal@worksync.com',
    comment: 'I will verify the frontend payload shape against the API response.',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const requiredTaskTitles = [
      ...new Set(taskComments.map((comment) => comment.task_title)),
    ];
    const requiredUserEmails = [
      ...new Set(taskComments.map((comment) => comment.user_email)),
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
    const values = taskComments.map((taskComment) => ({
      task_id: taskByTitle.get(taskComment.task_title),
      user_id: userByEmail.get(taskComment.user_email),
      comment: taskComment.comment,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('task_comments', {
      [Sequelize.Op.or]: values.map((taskComment) => ({
        task_id: taskComment.task_id,
        user_id: taskComment.user_id,
        comment: taskComment.comment,
      })),
    });

    await queryInterface.bulkInsert('task_comments', values);
  },

  async down(queryInterface, Sequelize) {
    const requiredTaskTitles = [
      ...new Set(taskComments.map((comment) => comment.task_title)),
    ];
    const requiredUserEmails = [
      ...new Set(taskComments.map((comment) => comment.user_email)),
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
    const deleteComments = taskComments
      .map((taskComment) => ({
        task_id: taskByTitle.get(taskComment.task_title),
        user_id: userByEmail.get(taskComment.user_email),
        comment: taskComment.comment,
      }))
      .filter((taskComment) => taskComment.task_id && taskComment.user_id);

    if (deleteComments.length === 0) {
      return;
    }

    await queryInterface.bulkDelete('task_comments', {
      [Sequelize.Op.or]: deleteComments,
    });
  },
};
