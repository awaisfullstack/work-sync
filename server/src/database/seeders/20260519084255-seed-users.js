'use strict';
const bcrypt = require('bcrypt');

const users = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Admin User',
    email: 'admin@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    name: 'Admin User 2',
    email: 'admin2@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    name: 'Admin User 3',
    email: 'admin3@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    id: '20000000-0000-4000-8000-000000000004',
    name: 'Admin User 4',
    email: 'admin4@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },
  {
    id: '20000000-0000-4000-8000-000000000005',
    name: 'Admin User 5',
    email: 'admin5@worksync.com',
    role: 'ADMIN',
    department_id: null,
  },

  {
    id: '20000000-0000-4000-8000-000000000006',
    name: 'Sara Malik',
    email: 'sara.malik@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000002',
  },
  {
    id: '20000000-0000-4000-8000-000000000007',
    name: 'Ayesha Noor',
    email: 'ayesha.noor@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000002',
  },
  {
    id: '20000000-0000-4000-8000-000000000008',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000002',
  },
  {
    id: '20000000-0000-4000-8000-000000000009',
    name: 'Zainab Ali',
    email: 'zainab.ali@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000002',
  },
  {
    id: '20000000-0000-4000-8000-000000000010',
    name: 'Maham Khan',
    email: 'maham.khan@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000002',
  },
  {
    id: '20000000-0000-4000-8000-000000000011',
    name: 'Hira Aslam',
    email: 'hira.aslam@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000002',
  },

  {
    id: '20000000-0000-4000-8000-000000000012',
    name: 'Ahmed Faraz',
    email: 'ahmed.faraz@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000003',
  },
  {
    id: '20000000-0000-4000-8000-000000000013',
    name: 'Danish Mehmood',
    email: 'danish.mehmood@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000003',
  },
  {
    id: '20000000-0000-4000-8000-000000000014',
    name: 'Saad Yousaf',
    email: 'saad.yousaf@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000003',
  },
  {
    id: '20000000-0000-4000-8000-000000000015',
    name: 'Noman Shah',
    email: 'noman.shah@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000003',
  },
  {
    id: '20000000-0000-4000-8000-000000000016',
    name: 'Taha Siddiqui',
    email: 'taha.siddiqui@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000001',
  },
  {
    id: '20000000-0000-4000-8000-000000000017',
    name: 'Imran Qureshi',
    email: 'imran.qureshi@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000001',
  },

  {
    id: '20000000-0000-4000-8000-000000000018',
    name: 'Maryam Iqbal',
    email: 'maryam.iqbal@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000004',
  },
  {
    id: '20000000-0000-4000-8000-000000000019',
    name: 'Laiba Hassan',
    email: 'laiba.hassan@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000004',
  },
  {
    id: '20000000-0000-4000-8000-000000000020',
    name: 'Iqra Javed',
    email: 'iqra.javed@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000004',
  },
  {
    id: '20000000-0000-4000-8000-000000000021',
    name: 'Sana Tariq',
    email: 'sana.tariq@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000004',
  },
  {
    id: '20000000-0000-4000-8000-000000000022',
    name: 'Noor Fatima',
    email: 'noor.fatima@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000001',
  },
  {
    id: '20000000-0000-4000-8000-000000000023',
    name: 'Hania Sheikh',
    email: 'hania.sheikh@worksync.com',
    role: 'EMPLOYEE',
    department_id: '10000000-0000-4000-8000-000000000001',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const password = await bcrypt.hash('Password@123', 10);
    await queryInterface.bulkInsert(
      'users',
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password,
        role: user.role,
        department_id: user.department_id,
        created_at: now,
        updated_at: now,
      })),
      {
        ignoreDuplicates: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      id: {
        [Sequelize.Op.in]: users.map((user) => user.id),
      },
    });
  },
};
