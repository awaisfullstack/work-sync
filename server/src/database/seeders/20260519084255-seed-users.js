'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = await queryInterface.sequelize.query(
      `
      SELECT id, name
      FROM departments
      WHERE name IN ('Engineering', 'Human Resources', 'Operations', 'Design', 'Development', 'Sales')
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const engineering = departments.find((dept) => dept.name === 'Engineering');
    const hr = departments.find((dept) => dept.name === 'Human Resources');
    const operations = departments.find((dept) => dept.name === 'Operations');
    const design = departments.find((dept) => dept.name === 'Design');
    const development = departments.find((dept) => dept.name === 'Development');
    const sales = departments.find((dept) => dept.name === 'Sales');

    if (
      !engineering ||
      !hr ||
      !operations ||
      !design ||
      !development ||
      !sales
    ) {
      throw new Error(
        'Required departments not found. Run department seeder first.',
      );
    }

    const password = await bcrypt.hash('Password@123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@worksync.com',
        role: 'ADMIN',
        department_id: null,
      },

      // Engineering Employees
      {
        name: 'Awais Khan',
        email: 'awais@worksync.com',
        role: 'EMPLOYEE',
        department_id: engineering.id,
      },
      {
        name: 'Ali Raza',
        email: 'ali.raza@worksync.com',
        role: 'EMPLOYEE',
        department_id: engineering.id,
      },
      {
        name: 'Hassan Ahmed',
        email: 'hassan.ahmed@worksync.com',
        role: 'EMPLOYEE',
        department_id: engineering.id,
      },
      {
        name: 'Bilal Akram',
        email: 'bilal.akram@worksync.com',
        role: 'EMPLOYEE',
        department_id: engineering.id,
      },
      {
        name: 'Usman Tariq',
        email: 'usman.tariq@worksync.com',
        role: 'EMPLOYEE',
        department_id: engineering.id,
      },
      {
        name: 'Hamza Iqbal',
        email: 'hamza.iqbal@worksync.com',
        role: 'EMPLOYEE',
        department_id: engineering.id,
      },

      // HR Employees
      {
        name: 'Sara Malik',
        email: 'sara.malik@worksync.com',
        role: 'EMPLOYEE',
        department_id: hr.id,
      },
      {
        name: 'Ayesha Noor',
        email: 'ayesha.noor@worksync.com',
        role: 'EMPLOYEE',
        department_id: hr.id,
      },
      {
        name: 'Fatima Zahra',
        email: 'fatima.zahra@worksync.com',
        role: 'EMPLOYEE',
        department_id: hr.id,
      },
      {
        name: 'Zainab Ali',
        email: 'zainab.ali@worksync.com',
        role: 'EMPLOYEE',
        department_id: hr.id,
      },
      {
        name: 'Maham Khan',
        email: 'maham.khan@worksync.com',
        role: 'EMPLOYEE',
        department_id: hr.id,
      },
      {
        name: 'Hira Aslam',
        email: 'hira.aslam@worksync.com',
        role: 'EMPLOYEE',
        department_id: hr.id,
      },

      // Operations Employees
      {
        name: 'Ahmed Faraz',
        email: 'ahmed.faraz@worksync.com',
        role: 'EMPLOYEE',
        department_id: operations.id,
      },
      {
        name: 'Danish Mehmood',
        email: 'danish.mehmood@worksync.com',
        role: 'EMPLOYEE',
        department_id: operations.id,
      },
      {
        name: 'Saad Yousaf',
        email: 'saad.yousaf@worksync.com',
        role: 'EMPLOYEE',
        department_id: operations.id,
      },
      {
        name: 'Noman Shah',
        email: 'noman.shah@worksync.com',
        role: 'EMPLOYEE',
        department_id: operations.id,
      },
      {
        name: 'Taha Siddiqui',
        email: 'taha.siddiqui@worksync.com',
        role: 'EMPLOYEE',
        department_id: operations.id,
      },
      {
        name: 'Imran Qureshi',
        email: 'imran.qureshi@worksync.com',
        role: 'EMPLOYEE',
        department_id: operations.id,
      },

      // Design Employees
      {
        name: 'Maryam Iqbal',
        email: 'maryam.iqbal@worksync.com',
        role: 'EMPLOYEE',
        department_id: design.id,
      },
      {
        name: 'Laiba Hassan',
        email: 'laiba.hassan@worksync.com',
        role: 'EMPLOYEE',
        department_id: design.id,
      },
      {
        name: 'Iqra Javed',
        email: 'iqra.javed@worksync.com',
        role: 'EMPLOYEE',
        department_id: design.id,
      },
      {
        name: 'Sana Tariq',
        email: 'sana.tariq@worksync.com',
        role: 'EMPLOYEE',
        department_id: design.id,
      },
      {
        name: 'Noor Fatima',
        email: 'noor.fatima@worksync.com',
        role: 'EMPLOYEE',
        department_id: design.id,
      },
      {
        name: 'Hania Sheikh',
        email: 'hania.sheikh@worksync.com',
        role: 'EMPLOYEE',
        department_id: design.id,
      },
    ];

    await queryInterface.bulkInsert(
      'users',
      users.map((user) => ({
        id: Sequelize.literal('gen_random_uuid()'),
        name: user.name,
        email: user.email,
        password,
        role: user.role,
        department_id: user.department_id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: [
        'admin@worksync.com',
        'awais@worksync.com',
        'ali.raza@worksync.com',
        'hassan.ahmed@worksync.com',
        'bilal.akram@worksync.com',
        'usman.tariq@worksync.com',
        'hamza.iqbal@worksync.com',

        'sara.malik@worksync.com',
        'ayesha.noor@worksync.com',
        'fatima.zahra@worksync.com',
        'zainab.ali@worksync.com',
        'maham.khan@worksync.com',
        'hira.aslam@worksync.com',

        'ahmed.faraz@worksync.com',
        'danish.mehmood@worksync.com',
        'saad.yousaf@worksync.com',
        'noman.shah@worksync.com',
        'taha.siddiqui@worksync.com',
        'imran.qureshi@worksync.com',

        'maryam.iqbal@worksync.com',
        'laiba.hassan@worksync.com',
        'iqra.javed@worksync.com',
        'sana.tariq@worksync.com',
        'noor.fatima@worksync.com',
        'hania.sheikh@worksync.com',
      ],
    });
  },
};
