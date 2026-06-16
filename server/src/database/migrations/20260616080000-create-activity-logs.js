'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      actor_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action: {
        type: Sequelize.ENUM(
          'PROJECT_CREATED',
          'PROJECT_UPDATED',
          'PROJECT_ARCHIVED',
          'PROJECT_MEMBER_ADDED',
          'PROJECT_MEMBER_REMOVED',
          'TASK_CREATED',
          'TASK_UPDATED',
          'TASK_DELETED',
          'TASK_STATUS_UPDATED',
          'TASK_ASSIGNED',
          'TASK_UNASSIGNED',
          'TASK_COMMENT_ADDED',
          'TASK_COMMENT_DELETED',
          'SHIFT_CLOCKED_IN',
          'SHIFT_CLOCKED_OUT'
        ),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.ENUM(
          'PROJECT',
          'TASK',
          'TASK_COMMENT',
          'TASK_ASSIGNMENT',
          'SHIFT',
          'USER'
        ),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('activity_logs', ['created_at'], {
      name: 'activity_logs_created_at_idx',
    });
    await queryInterface.addIndex('activity_logs', ['updated_at'], {
      name: 'activity_logs_updated_at_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_logs');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_activity_logs_action";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_activity_logs_entity_type";'
    );
  },
};
