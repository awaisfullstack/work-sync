'use strict';

const departments = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    name: 'Development',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    name: 'Human Resources',
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    name: 'Operations',
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    name: 'Design',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'departments',
      departments.map((department) => ({
        id: department.id,
        name: department.name,
        created_at: now,
        updated_at: now,
      })),
      {
        ignoreDuplicates: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', {
      [Sequelize.Op.or]: [
        {
          id: {
            [Sequelize.Op.in]: departments.map((department) => department.id),
          },
        },
        {
          name: {
            [Sequelize.Op.in]: departments.map(
              (department) => department.name,
            ),
          },
        },
      ],
    });
  },
};
