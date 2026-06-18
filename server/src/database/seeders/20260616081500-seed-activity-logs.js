'use strict';

const activityLogs = [
  {
    id: '70000000-0000-4000-8000-000000000001',
    actor_id: '20000000-0000-4000-8000-000000000001',
    action: 'PROJECT_CREATED',
    entity_type: 'PROJECT',
    entity_id: '30000000-0000-4000-8000-000000000001',
    message: 'Project "WorkSync Backend API" was created.',
  },
  {
    id: '70000000-0000-4000-8000-000000000002',
    actor_id: '20000000-0000-4000-8000-000000000001',
    action: 'PROJECT_CREATED',
    entity_type: 'PROJECT',
    entity_id: '30000000-0000-4000-8000-000000000002',
    message: 'Project "WorkSync Frontend Dashboard" was created.',
  },
  {
    id: '70000000-0000-4000-8000-000000000003',
    actor_id: '20000000-0000-4000-8000-000000000001',
    action: 'TASK_CREATED',
    entity_type: 'TASK',
    entity_id: '50000000-0000-4000-8000-000000000001',
    message: 'Task "Implement JWT authentication" was created.',
  },
  {
    id: '70000000-0000-4000-8000-000000000004',
    actor_id: '20000000-0000-4000-8000-000000000004',
    action: 'TASK_ASSIGNED',
    entity_type: 'TASK_ASSIGNMENT',
    entity_id: '51000000-0000-4000-8000-000000000001',
    message: 'A user was assigned to task "Implement JWT authentication".',
  },
  {
    id: '70000000-0000-4000-8000-000000000005',
    actor_id: '20000000-0000-4000-8000-000000000006',
    action: 'TASK_COMMENT_ADDED',
    entity_type: 'TASK_COMMENT',
    entity_id: '52000000-0000-4000-8000-000000000001',
    message: 'A comment was added on task "Implement JWT authentication".',
  },
  {
    id: '70000000-0000-4000-8000-000000000006',
    actor_id: '20000000-0000-4000-8000-000000000008',
    action: 'TASK_COMMENT_ADDED',
    entity_type: 'TASK_COMMENT',
    entity_id: '52000000-0000-4000-8000-000000000003',
    message: 'A comment was added on task "Create Projects API".',
  },
  {
    id: '70000000-0000-4000-8000-000000000007',
    actor_id: '20000000-0000-4000-8000-000000000002',
    action: 'TASK_STATUS_UPDATED',
    entity_type: 'TASK',
    entity_id: '50000000-0000-4000-8000-000000000003',
    message: 'Task "Build task status workflow" status was updated to IN_PROGRESS.',
  },
  {
    id: '70000000-0000-4000-8000-000000000008',
    actor_id: '20000000-0000-4000-8000-000000000003',
    action: 'TASK_STATUS_UPDATED',
    entity_type: 'TASK',
    entity_id: '50000000-0000-4000-8000-000000000007',
    message: 'Task "Create QA smoke test checklist" status was updated to COMPLETED.',
  },
  {
    id: '70000000-0000-4000-8000-000000000009',
    actor_id: '20000000-0000-4000-8000-000000000006',
    action: 'SHIFT_CLOCKED_IN',
    entity_type: 'SHIFT',
    entity_id: '60000000-0000-4000-8000-000000000001',
    message: 'Sara Malik clocked in.',
  },
  {
    id: '70000000-0000-4000-8000-000000000010',
    actor_id: '20000000-0000-4000-8000-000000000006',
    action: 'SHIFT_CLOCKED_OUT',
    entity_type: 'SHIFT',
    entity_id: '60000000-0000-4000-8000-000000000001',
    message: 'A user clocked out.',
  },
  {
    id: '70000000-0000-4000-8000-000000000011',
    actor_id: '20000000-0000-4000-8000-000000000020',
    action: 'TASK_COMMENT_ADDED',
    entity_type: 'TASK_COMMENT',
    entity_id: '52000000-0000-4000-8000-000000000012',
    message: 'A comment was added on task "Implement shift summary widget".',
  },
  {
    id: '70000000-0000-4000-8000-000000000012',
    actor_id: '20000000-0000-4000-8000-000000000004',
    action: 'PROJECT_MEMBER_REMOVED',
    entity_type: 'PROJECT',
    entity_id: '30000000-0000-4000-8000-000000000002',
    message: 'A member was removed from project "WorkSync Frontend Dashboard".',
  },
  {
    id: '70000000-0000-4000-8000-000000000013',
    actor_id: '20000000-0000-4000-8000-000000000001',
    action: 'DEPARTMENT_CREATED',
    entity_type: 'DEPARTMENT',
    entity_id: '10000000-0000-4000-8000-000000000001',
    message: 'Department "Development" was created.',
  },
  {
    id: '70000000-0000-4000-8000-000000000014',
    actor_id: '20000000-0000-4000-8000-000000000004',
    action: 'SHIFT_MANUAL_CREATED',
    entity_type: 'SHIFT',
    entity_id: '60000000-0000-4000-8000-000000000002',
    message: 'Manual shift was created for Ayesha Noor.',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const values = activityLogs.map((activityLog) => ({
      id: activityLog.id,
      actor_id: activityLog.actor_id,
      action: activityLog.action,
      entity_type: activityLog.entity_type,
      entity_id: activityLog.entity_id,
      message: activityLog.message,
      created_at: now,
    }));

    await queryInterface.bulkDelete('activity_logs', {
      id: {
        [Sequelize.Op.in]: activityLogs.map((activityLog) => activityLog.id),
      },
    });

    await queryInterface.bulkInsert('activity_logs', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity_logs', {
      id: {
        [Sequelize.Op.in]: activityLogs.map((activityLog) => activityLog.id),
      },
    });
  },
};
