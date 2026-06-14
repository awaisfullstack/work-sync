'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM('ADMIN', 'EMPLOYEE'),
        allowNull: false,
        defaultValue: 'EMPLOYEE',
      },

      department_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'departments',
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

    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_idx',
    });
    await queryInterface.addIndex('users', ['role'], {
      name: 'users_role_idx',
    });
    await queryInterface.addIndex('users', ['department_id'], {
      name: 'users_department_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";',
    );
  },
};
