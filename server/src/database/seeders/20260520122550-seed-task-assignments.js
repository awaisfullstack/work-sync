'use strict';

function taskId(num) {
  return `00000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
}

function assignmentId(num) {
  return `10000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(`
      SELECT id
      FROM users
      ORDER BY created_at ASC
    `);

    const [tasks] = await queryInterface.sequelize.query(`
      SELECT id, project_id, created_by
      FROM tasks
      WHERE id IN (${Array.from({ length: 50 }, (_, index) => `'${taskId(index + 1)}'`).join(',')})
      ORDER BY created_at ASC
    `);

    const [projectMembers] = await queryInterface.sequelize.query(`
      SELECT project_id, user_id
      FROM project_members
    `);

    if (!users.length) {
      throw new Error('No users found. Please run user seeders first.');
    }

    if (!tasks.length) {
      throw new Error('No tasks found. Please run task seeders first.');
    }

    const assignments = [];
    let assignmentCounter = 1;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      const membersOfProject = projectMembers.filter(
        (member) => member.project_id === task.project_id,
      );

      const availableUsers = membersOfProject.length
        ? membersOfProject.map((member) => member.user_id)
        : users.map((user) => user.id);

      const assignmentCount = i % 3 === 0 ? 2 : 1;

      for (let j = 0; j < assignmentCount; j++) {
        const userId = availableUsers[(i + j) % availableUsers.length];

        const alreadyAssigned = assignments.some(
          (assignment) =>
            assignment.task_id === task.id &&
            assignment.user_id === userId &&
            assignment.unassigned_at === null,
        );

        if (alreadyAssigned) continue;

        assignments.push({
          id: assignmentId(assignmentCounter),
          task_id: task.id,
          user_id: userId,
          assigned_by: task.created_by || users[0].id,
          assigned_at: new Date(),
          unassigned_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        });

        assignmentCounter++;
      }
    }

    await queryInterface.bulkInsert('task_assignments', assignments, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('task_assignments', {
      id: Array.from({ length: 100 }, (_, index) => assignmentId(index + 1)),
    });
  },
};
