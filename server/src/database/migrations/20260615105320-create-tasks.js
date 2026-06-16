'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'task_statuses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_by_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    await queryInterface.addIndex('tasks', ['due_date'], {
      name: 'tasks_due_date_idx',
    });
    await queryInterface.addIndex('tasks', ['status_id'], {
      name: 'tasks_status_id_idx',
    });
    await queryInterface.addIndex('tasks', ['created_by_id'], {
      name: 'tasks_created_by_id_idx',
    });
    await queryInterface.addIndex('tasks', ['project_id'], {
      name: 'tasks_project_id_idx',
    });
    await queryInterface.addIndex('tasks', ['created_at'], {
      name: 'tasks_created_at_idx',
    });
    await queryInterface.addIndex('tasks', ['updated_at'], {
      name: 'tasks_updated_at_idx',
    });
    await queryInterface.addIndex('tasks', ['project_id', 'status_id'], {
      name: 'tasks_project_id_status_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  },
};
