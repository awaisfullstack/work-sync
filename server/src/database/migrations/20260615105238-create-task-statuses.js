'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_statuses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.ENUM('TODO', 'IN_PROGRESS', 'COMPLETED'),
        allowNull: false,
        unique: true,
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
    await queryInterface.addIndex('task_statuses', ['name'], {
      name: 'task_statuses_name_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_statuses');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_task_statuses_name";',
    );
  },
};
