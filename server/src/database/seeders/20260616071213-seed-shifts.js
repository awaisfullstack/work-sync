'use strict';

const shifts = [
  {
    id: '60000000-0000-4000-8000-000000000001',
    user_id: '20000000-0000-4000-8000-000000000006',
    clock_in_at: new Date('2026-06-15T09:00:00'),
    clock_out_at: new Date('2026-06-15T17:00:00'),
    status: 'COMPLETED',
  },
  {
    id: '60000000-0000-4000-8000-000000000002',
    user_id: '20000000-0000-4000-8000-000000000007',
    clock_in_at: new Date('2026-06-15T10:00:00'),
    clock_out_at: new Date('2026-06-15T18:00:00'),
    status: 'COMPLETED',
  },
  {
    id: '60000000-0000-4000-8000-000000000003',
    user_id: '20000000-0000-4000-8000-000000000008',
    clock_in_at: new Date('2026-06-16T09:00:00'),
    clock_out_at: new Date('2026-06-16T16:00:00'),
    status: 'COMPLETED',
  },
  {
    id: '60000000-0000-4000-8000-000000000004',
    user_id: '20000000-0000-4000-8000-000000000012',
    clock_in_at: new Date('2026-06-16T08:00:00'),
    clock_out_at: new Date('2026-06-16T16:00:00'),
    status: 'COMPLETED',
  },
  {
    id: '60000000-0000-4000-8000-000000000005',
    user_id: '20000000-0000-4000-8000-000000000013',
    clock_in_at: new Date('2026-06-17T09:00:00'),
    clock_out_at: new Date('2026-06-17T17:00:00'),
    status: 'COMPLETED',
  },
  {
    id: '60000000-0000-4000-8000-000000000006',
    user_id: '20000000-0000-4000-8000-000000000018',
    clock_in_at: new Date('2026-06-17T10:00:00'),
    clock_out_at: new Date('2026-06-17T15:00:00'),
    status: 'COMPLETED',
  },
  {
    id: '60000000-0000-4000-8000-000000000007',
    user_id: '20000000-0000-4000-8000-000000000016',
    clock_in_at: new Date('2026-06-18T09:00:00'),
    clock_out_at: null,
    status: 'ACTIVE',
  },
  {
    id: '60000000-0000-4000-8000-000000000008',
    user_id: '20000000-0000-4000-8000-000000000019',
    clock_in_at: new Date('2026-06-18T10:00:00'),
    clock_out_at: null,
    status: 'ACTIVE',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const values = shifts.map((shift) => ({
      id: shift.id,
      user_id: shift.user_id,
      clock_in_at: shift.clock_in_at,
      clock_out_at: shift.clock_out_at,
      status: shift.status,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('shifts', {
      id: {
        [Sequelize.Op.in]: shifts.map((shift) => shift.id),
      },
    });

    await queryInterface.bulkInsert('shifts', values);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shifts', {
      id: {
        [Sequelize.Op.in]: shifts.map((shift) => shift.id),
      },
    });
  },
};
