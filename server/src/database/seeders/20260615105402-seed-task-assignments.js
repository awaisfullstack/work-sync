'use strict';

const taskAssignments = [
  {
    id: '51000000-0000-4000-8000-000000000001',
    task_id: '50000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000006',
    assigned_by: '20000000-0000-4000-8000-000000000004',
  },
  {
    id: '51000000-0000-4000-8000-000000000002',
    task_id: '50000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000007',
    assigned_by: '20000000-0000-4000-8000-000000000004',
  },
  {
    id: '51000000-0000-4000-8000-000000000003',
    task_id: '50000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000008',
    assigned_by: '20000000-0000-4000-8000-000000000004',
  },
  {
    id: '51000000-0000-4000-8000-000000000004',
    task_id: '50000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000009',
    assigned_by: '20000000-0000-4000-8000-000000000004',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const values = taskAssignments.map((assignment) => ({
      id: assignment.id,
      task_id: assignment.task_id,
      user_id: assignment.user_id,
      assigned_by: assignment.assigned_by,
      assigned_at: now,
      unassigned_at: null,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('task_assignments', {
      id: {
        [Sequelize.Op.in]: taskAssignments.map((assignment) => assignment.id),
      },
    });

    await queryInterface.bulkInsert('task_assignments', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('task_assignments', {
      id: {
        [Sequelize.Op.in]: taskAssignments.map((assignment) => assignment.id),
      },
    });
  },
};
