'use strict';

function taskId(num) {
  return `00000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
}

function commentId(num) {
  return `20000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
}

const commentMessages = [
  'I have started working on this task.',
  'Please review the current progress.',
  'This task needs more clarification before implementation.',
  'The basic implementation has been completed.',
  'I found one issue while testing this task.',
  'This task is blocked because another module is not ready yet.',
  'The API is working correctly in Postman.',
  'Frontend integration is pending for this task.',
  'I have pushed the latest changes.',
  'Please assign another team member for review.',
  'Validation has been added successfully.',
  'The database relation is working correctly.',
  'This task can be moved to completed after final testing.',
  'I updated the implementation based on feedback.',
  'Need to improve error handling for this feature.',
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(`
      SELECT id
      FROM users
      ORDER BY created_at ASC
    `);

    const [tasks] = await queryInterface.sequelize.query(`
      SELECT id
      FROM tasks
      WHERE id IN (${Array.from({ length: 50 }, (_, index) => `'${taskId(index + 1)}'`).join(',')})
      ORDER BY created_at ASC
    `);

    if (!users.length) {
      throw new Error('No users found. Please run user seeders first.');
    }

    if (!tasks.length) {
      throw new Error('No tasks found. Please run task seeders first.');
    }

    const comments = [];
    let commentCounter = 1;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      const commentsPerTask = i % 2 === 0 ? 3 : 2;

      for (let j = 0; j < commentsPerTask; j++) {
        comments.push({
          id: commentId(commentCounter),
          task_id: task.id,
          user_id: users[(i + j) % users.length].id,
          comment: commentMessages[(i + j) % commentMessages.length],
          created_at: new Date(),
          updated_at: new Date(),
        });

        commentCounter++;
      }
    }

    await queryInterface.bulkInsert('task_comments', comments, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('task_comments', {
      id: Array.from({ length: 150 }, (_, index) => commentId(index + 1)),
    });
  },
};
