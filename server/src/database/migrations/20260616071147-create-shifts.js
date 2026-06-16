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
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('shifts', ['user_id'], {
      name: 'shifts_user_id_idx',
    });
    await queryInterface.addIndex('shifts', ['status'], {
      name: 'shifts_status_idx',
    });
    await queryInterface.addIndex('shifts', ['clock_in_at'], {
      name: 'shifts_clock_in_at_idx',
    });
    await queryInterface.addIndex('shifts', ['user_id', 'status'], {
      name: 'shifts_user_id_status_idx',
    });
    await queryInterface.addIndex('shifts', ['user_id', 'clock_in_at'], {
      name: 'shifts_user_id_clock_in_at_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shifts');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_shifts_status";',
    );
  },
};
