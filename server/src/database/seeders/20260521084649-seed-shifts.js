'use strict';

const { randomUUID } = require('crypto');

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function setTime(date, hours, minutes = 0) {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const employees = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE role = 'EMPLOYEE'
      ORDER BY created_at ASC
      LIMIT 10;
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    if (employees.length < 5) {
      throw new Error('At least 5 EMPLOYEE users are required to seed shifts.');
    }

    const today = new Date();
    const rows = [];

    employees.forEach((employee, employeeIndex) => {
      for (let dayOffset = -10; dayOffset <= -1; dayOffset++) {
        const shiftDate = addDays(today, dayOffset);

        const clockInAt = setTime(
          shiftDate,
          9 + (employeeIndex % 2),
          employeeIndex % 2 === 0 ? 0 : 30,
        );

        const clockOutAt = setTime(
          shiftDate,
          17 + (employeeIndex % 2),
          employeeIndex % 2 === 0 ? 0 : 15,
        );

        rows.push({
          id: randomUUID(),
          user_id: employee.id,
          clock_in_at: clockInAt,
          clock_out_at: clockOutAt,
          status: 'COMPLETED',
          created_at: clockInAt,
          updated_at: clockOutAt,
        });
      }
    });

    /**
     * Add one active shift for first employee.
     * Because of partial unique index, only one active shift per employee is allowed.
     */
    rows.push({
      id: randomUUID(),
      user_id: employees[0].id,
      clock_in_at: setTime(today, 9, 0),
      clock_out_at: setTime(today, 9, 0),
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert('shifts', rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shifts', null, {});
  },
};
