'use strict';

function activityId(num) {
  return `30000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
}

const actions = [
  'PROJECT_CREATED',
  'PROJECT_UPDATED',
  'PROJECT_MEMBER_ADDED',
  'TASK_CREATED',
  'TASK_STATUS_UPDATED',
  'TASK_ASSIGNED',
  'TASK_COMMENT_ADDED',
  'SHIFT_CLOCKED_IN',
  'SHIFT_CLOCKED_OUT',
];

const entityTypes = [
  'PROJECT',
  'PROJECT',
  'PROJECT',
  'TASK',
  'TASK',
  'TASK',
  'TASK_COMMENT',
  'SHIFT',
  'SHIFT',
];

const messages = [
  'A new project was created.',
  'Project details were updated.',
  'A member was added to a project.',
  'A new task was created.',
  'Task status was updated.',
  'A user was assigned to a task.',
  'A comment was added to a task.',
  'User clocked in.',
  'User clocked out.',
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const [users] = await queryInterface.sequelize.query(`
      SELECT id FROM users ORDER BY created_at ASC
    `);

    const [projects] = await queryInterface.sequelize.query(`
      SELECT id FROM projects ORDER BY created_at ASC
    `);

    const [tasks] = await queryInterface.sequelize.query(`
      SELECT id, project_id FROM tasks ORDER BY created_at ASC
    `);

    const [shifts] = await queryInterface.sequelize.query(`
      SELECT id, user_id FROM shifts ORDER BY created_at ASC
    `);

    if (!users.length) {
      throw new Error('No users found. Please run users seeder first.');
    }

    const logs = [];

    for (let i = 0; i < 60; i++) {
      const actionIndex = i % actions.length;
      const action = actions[actionIndex];
      const entityType = entityTypes[actionIndex];

      const user = users[i % users.length];
      const project = projects.length ? projects[i % projects.length] : null;
      const task = tasks.length ? tasks[i % tasks.length] : null;
      const shift = shifts.length ? shifts[i % shifts.length] : null;

      let entityId = null;
      let projectId = project?.id ?? null;

      if (entityType === 'PROJECT') {
        entityId = project?.id ?? null;
        projectId = project?.id ?? null;
      }

      if (entityType === 'TASK' || entityType === 'TASK_COMMENT') {
        entityId = task?.id ?? null;
        projectId = task?.project_id ?? projectId;
      }

      if (entityType === 'SHIFT') {
        entityId = shift?.id ?? null;
        projectId = null;
      }

      logs.push({
        id: activityId(i + 1),
        actor_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        project_id: projectId,
        message: messages[actionIndex],
        metadata: JSON.stringify({
          seed: true,
          index: i + 1,
        }),
        created_at: new Date(Date.now() - i * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - i * 60 * 60 * 1000),
      });
    }

    await queryInterface.bulkInsert('activity_logs', logs, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity_logs', {
      id: Array.from({ length: 60 }, (_, index) => activityId(index + 1)),
    });
  }
};
