'use strict';

const projectMembers = [
  {
    id: '31000000-0000-4000-8000-000000000001',
    project_id: '30000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000016',
    role_in_project: 'LEAD',
  },
  {
    id: '31000000-0000-4000-8000-000000000002',
    project_id: '30000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000017',
    role_in_project: 'MEMBER',
  },
  {
    id: '31000000-0000-4000-8000-000000000003',
    project_id: '30000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000022',
    role_in_project: 'MEMBER',
  },
  {
    id: '31000000-0000-4000-8000-000000000004',
    project_id: '30000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000018',
    role_in_project: 'LEAD',
  },
  {
    id: '31000000-0000-4000-8000-000000000005',
    project_id: '30000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000019',
    role_in_project: 'MEMBER',
  },
  {
    id: '31000000-0000-4000-8000-000000000006',
    project_id: '30000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000023',
    role_in_project: 'MEMBER',
  },
  {
    id: '31000000-0000-4000-8000-000000000007',
    project_id: '30000000-0000-4000-8000-000000000003',
    user_id: '20000000-0000-4000-8000-000000000006',
    role_in_project: 'LEAD',
  },
  {
    id: '31000000-0000-4000-8000-000000000008',
    project_id: '30000000-0000-4000-8000-000000000003',
    user_id: '20000000-0000-4000-8000-000000000007',
    role_in_project: 'MEMBER',
  },
  {
    id: '31000000-0000-4000-8000-000000000009',
    project_id: '30000000-0000-4000-8000-000000000004',
    user_id: '20000000-0000-4000-8000-000000000012',
    role_in_project: 'LEAD',
  },
  {
    id: '31000000-0000-4000-8000-000000000010',
    project_id: '30000000-0000-4000-8000-000000000004',
    user_id: '20000000-0000-4000-8000-000000000013',
    role_in_project: 'MEMBER',
  },
  {
    id: '31000000-0000-4000-8000-000000000011',
    project_id: '30000000-0000-4000-8000-000000000005',
    user_id: '20000000-0000-4000-8000-000000000020',
    role_in_project: 'LEAD',
  },
  {
    id: '31000000-0000-4000-8000-000000000012',
    project_id: '30000000-0000-4000-8000-000000000005',
    user_id: '20000000-0000-4000-8000-000000000021',
    role_in_project: 'MEMBER',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const values = projectMembers.map((member) => ({
      id: member.id,
      project_id: member.project_id,
      user_id: member.user_id,
      role_in_project: member.role_in_project,
      joined_at: now,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('project_members', {
      id: {
        [Sequelize.Op.in]: projectMembers.map((member) => member.id),
      },
    });

    await queryInterface.bulkInsert('project_members', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project_members', {
      id: {
        [Sequelize.Op.in]: projectMembers.map((member) => member.id),
      },
    });
  },
};
