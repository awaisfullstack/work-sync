'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shifts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
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

      clock_in_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      clock_out_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM('ACTIVE', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('shifts', ['user_id']);
    await queryInterface.addIndex('shifts', ['status']);
    await queryInterface.addIndex('shifts', ['clock_in_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shifts');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_shifts_status";',
    );
  },
};
