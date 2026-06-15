'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_assignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      task_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      assigned_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      unassigned_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('task_assignments', ['task_id'], {
      name: 'task_assignments_task_id_idx',
    });
    await queryInterface.addIndex('task_assignments', ['user_id'], {
      name: 'task_assignments_user_id_idx',
    });
    await queryInterface.addIndex('task_assignments', ['assigned_by'], {
      name: 'task_assignments_assigned_by_idx',
    });
    await queryInterface.addIndex(
      'task_assignments',
      ['task_id', 'user_id', 'unassigned_at'],
      {
        name: 'task_assignments_task_id_user_id_unassigned_at_idx',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_assignments');
  },
};
