'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });

    await queryInterface.addIndex('users', ['is_active'], {
      name: 'users_is_active_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_is_active_idx');
    await queryInterface.removeColumn('users', 'is_active');
  },
};
