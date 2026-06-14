'use strict';

const projectMembers = [
  {
    project_title: 'WorkSync Backend API',
    user_email: 'taha.siddiqui@worksync.com',
    role_in_project: 'LEAD',
  },
  {
    project_title: 'WorkSync Backend API',
    user_email: 'imran.qureshi@worksync.com',
    role_in_project: 'MEMBER',
  },
  {
    project_title: 'WorkSync Backend API',
    user_email: 'noor.fatima@worksync.com',
    role_in_project: 'MEMBER',
  },
  {
    project_title: 'WorkSync Frontend Dashboard',
    user_email: 'maryam.iqbal@worksync.com',
    role_in_project: 'LEAD',
  },
  {
    project_title: 'WorkSync Frontend Dashboard',
    user_email: 'laiba.hassan@worksync.com',
    role_in_project: 'MEMBER',
  },
  {
    project_title: 'WorkSync Frontend Dashboard',
    user_email: 'hania.sheikh@worksync.com',
    role_in_project: 'MEMBER',
  },
  {
    project_title: 'Internal HR Portal',
    user_email: 'sara.malik@worksync.com',
    role_in_project: 'LEAD',
  },
  {
    project_title: 'Internal HR Portal',
    user_email: 'ayesha.noor@worksync.com',
    role_in_project: 'MEMBER',
  },
  {
    project_title: 'QA Automation Setup',
    user_email: 'ahmed.faraz@worksync.com',
    role_in_project: 'LEAD',
  },
  {
    project_title: 'QA Automation Setup',
    user_email: 'danish.mehmood@worksync.com',
    role_in_project: 'MEMBER',
  },
  {
    project_title: 'Reporting and Analytics Module',
    user_email: 'iqra.javed@worksync.com',
    role_in_project: 'LEAD',
  },
  {
    project_title: 'Reporting and Analytics Module',
    user_email: 'sana.tariq@worksync.com',
    role_in_project: 'MEMBER',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const requiredProjectTitles = [
      ...new Set(projectMembers.map((member) => member.project_title)),
    ];
    const requiredUserEmails = [
      ...new Set(projectMembers.map((member) => member.user_email)),
    ];

    const projectRows = await queryInterface.sequelize.query(
      `
      SELECT id, title
      FROM projects
      WHERE title IN (:titles)
      `,
      {
        replacements: { titles: requiredProjectTitles },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const userRows = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE email IN (:emails)
      `,
      {
        replacements: { emails: requiredUserEmails },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const projectByTitle = new Map(
      projectRows.map((project) => [project.title, project.id]),
    );
    const userByEmail = new Map(userRows.map((user) => [user.email, user.id]));

    const missingProjects = requiredProjectTitles.filter(
      (title) => !projectByTitle.has(title),
    );
    const missingUsers = requiredUserEmails.filter(
      (email) => !userByEmail.has(email),
    );

    if (missingProjects.length > 0) {
      throw new Error(
        `Required projects not found: ${missingProjects.join(', ')}`,
      );
    }

    if (missingUsers.length > 0) {
      throw new Error(`Required users not found: ${missingUsers.join(', ')}`);
    }

    const now = new Date();
    const values = projectMembers.map((member) => ({
      project_id: projectByTitle.get(member.project_title),
      user_id: userByEmail.get(member.user_email),
      role_in_project: member.role_in_project,
      joined_at: now,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete('project_members', {
      [Sequelize.Op.or]: values.map((member) => ({
        project_id: member.project_id,
        user_id: member.user_id,
      })),
    });

    await queryInterface.bulkInsert('project_members', values);
  },

  async down(queryInterface, Sequelize) {
    const requiredProjectTitles = [
      ...new Set(projectMembers.map((member) => member.project_title)),
    ];
    const requiredUserEmails = [
      ...new Set(projectMembers.map((member) => member.user_email)),
    ];

    const projectRows = await queryInterface.sequelize.query(
      `
      SELECT id, title
      FROM projects
      WHERE title IN (:titles)
      `,
      {
        replacements: { titles: requiredProjectTitles },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const userRows = await queryInterface.sequelize.query(
      `
      SELECT id, email
      FROM users
      WHERE email IN (:emails)
      `,
      {
        replacements: { emails: requiredUserEmails },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const projectByTitle = new Map(
      projectRows.map((project) => [project.title, project.id]),
    );
    const userByEmail = new Map(userRows.map((user) => [user.email, user.id]));
    const deletePairs = projectMembers
      .map((member) => ({
        project_id: projectByTitle.get(member.project_title),
        user_id: userByEmail.get(member.user_email),
      }))
      .filter((member) => member.project_id && member.user_id);

    if (deletePairs.length === 0) {
      return;
    }

    await queryInterface.bulkDelete('project_members', {
      [Sequelize.Op.or]: deletePairs,
    });
  },
};
