'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
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
      status: {
        type: Sequelize.ENUM('ACTIVE', 'COMPLETED', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      deadline: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
      archived_at: {
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
    await queryInterface.addIndex('projects', ['deadline'], {
      name: 'projects_deadline_idx',
    });
    await queryInterface.addIndex('projects', ['created_by_id'], {
      name: 'projects_created_by_id_idx',
    });
    await queryInterface.addIndex('projects', ['created_at'], {
      name: 'projects_created_at_idx',
    });
    await queryInterface.addIndex('projects', ['updated_at'], {
      name: 'projects_updated_at_idx',
    });
    await queryInterface.addIndex('projects', ['status', 'deadline'], {
      name: 'projects_status_deadline_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_projects_status";'
    );
  },
};
