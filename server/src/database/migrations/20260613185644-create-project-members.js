'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
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
      role_in_project: {
        type: Sequelize.ENUM('MEMBER', 'LEAD'),
        allowNull: false,
        defaultValue: 'MEMBER',
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
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

    await queryInterface.addIndex('project_members', ['project_id', 'user_id'], {
      name: 'project_members_project_id_user_id_idx',
      unique: true,
    });
    await queryInterface.addIndex('project_members', ['user_id'], {
      name: 'project_members_user_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_members');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_project_members_role_in_project";',
    );
  },
};
