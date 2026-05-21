'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      entity_type: {
        type: Sequelize.STRING(50),
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

    await queryInterface.addIndex('activity_logs', ['actor_id']);
    await queryInterface.addIndex('activity_logs', ['action']);
    await queryInterface.addIndex('activity_logs', ['entity_type']);
    await queryInterface.addIndex('activity_logs', ['entity_id']);
    await queryInterface.addIndex('activity_logs', ['project_id']);
    await queryInterface.addIndex('activity_logs', ['created_at']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_logs');
  }
};
