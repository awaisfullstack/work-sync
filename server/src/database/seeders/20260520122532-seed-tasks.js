'use strict';

const TODO_STATUS_ID = '11111111-1111-1111-1111-111111111111';
const IN_PROGRESS_STATUS_ID = '22222222-2222-2222-2222-222222222222';
const COMPLETED_STATUS_ID = '33333333-3333-3333-3333-333333333333';

function taskId(num) {
  return `00000000-0000-4000-8000-${String(num).padStart(12, '0')}`;
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

const taskTemplates = [
  {
    title: 'Create authentication API documentation',
    description: 'Write complete API documentation for register, login, logout, and protected routes.',
  },
  {
    title: 'Design task list page UI',
    description: 'Create a clean task list UI with filters, pagination, and sorting controls.',
  },
  {
    title: 'Implement task status update API',
    description: 'Allow users to update task status from TODO to IN_PROGRESS or COMPLETED.',
  },
  {
    title: 'Create project dashboard cards',
    description: 'Show total projects, active projects, completed tasks, and weekly hours.',
  },
  {
    title: 'Add project member validation',
    description: 'Validate that assigned users belong to the selected project.',
  },
  {
    title: 'Build task comments feature',
    description: 'Allow users to add comments on tasks with user and timestamp information.',
  },
  {
    title: 'Create reusable response interceptor',
    description: 'Make all API responses follow the same success response format.',
  },
  {
    title: 'Improve global exception filter',
    description: 'Handle validation, auth, forbidden, not found, and internal server errors centrally.',
  },
  {
    title: 'Add frontend task filters',
    description: 'Add filters by status, project, assigned user, and date range.',
  },
  {
    title: 'Create task detail page',
    description: 'Show task information, assignees, comments, project, status, and due date.',
  },
  {
    title: 'Add pagination helper',
    description: 'Create reusable pagination utility for tasks, projects, and activity lists.',
  },
  {
    title: 'Implement task assignment history',
    description: 'Store who assigned a task and when the task was assigned.',
  },
  {
    title: 'Create task seed data',
    description: 'Generate realistic task seed data for testing dashboard and filters.',
  },
  {
    title: 'Fix role based route access',
    description: 'Ensure admin and employee routes are protected correctly.',
  },
  {
    title: 'Add request validation pipes',
    description: 'Validate request bodies, query parameters, and route params.',
  },
  {
    title: 'Create project activity placeholder',
    description: 'Prepare structure for future activity tracking and audit logs.',
  },
  {
    title: 'Add task sorting support',
    description: 'Support sorting by createdAt, updatedAt, and dueDate.',
  },
  {
    title: 'Create employee task view',
    description: 'Employees should only view tasks from projects they belong to.',
  },
  {
    title: 'Test task APIs in Postman',
    description: 'Test create, update, assign, unassign, comment, filter, and delete APIs.',
  },
  {
    title: 'Add task module to app module',
    description: 'Register task models and task module in the main application module.',
  },
  {
    title: 'Create shift clock in API',
    description: 'Allow employees to clock in and start an active shift.',
  },
  {
    title: 'Create shift clock out API',
    description: 'Allow employees to clock out and calculate worked hours.',
  },
  {
    title: 'Prevent multiple active shifts',
    description: 'Make sure one employee cannot have more than one active shift.',
  },
  {
    title: 'Create weekly worked hours query',
    description: 'Calculate weekly worked hours for dashboard statistics.',
  },
  {
    title: 'Build dashboard SSR page',
    description: 'Fetch dashboard data on initial request using server side rendering.',
  },
  {
    title: 'Create frontend logger API route',
    description: 'Create Next.js API route to receive frontend structured logs.',
  },
  {
    title: 'Add auth persistence on frontend',
    description: 'Persist authentication state and restore user session correctly.',
  },
  {
    title: 'Create RTK Query task API',
    description: 'Add create, update, delete, assign, comment, and list endpoints.',
  },
  {
    title: 'Create reusable table component',
    description: 'Build reusable table component for tasks, projects, and users.',
  },
  {
    title: 'Add loading and error states',
    description: 'Show proper loading spinners, empty state, and API error messages.',
  },
  {
    title: 'Create task status badge component',
    description: 'Display TODO, IN_PROGRESS, and COMPLETED with different badge styles.',
  },
  {
    title: 'Implement archive project restrictions',
    description: 'Prevent new tasks from being created inside archived projects.',
  },
  {
    title: 'Add database indexes for task filters',
    description: 'Add indexes on project_id, status_id, due_date, and created_at.',
  },
  {
    title: 'Create task search feature',
    description: 'Allow searching tasks by title and description.',
  },
  {
    title: 'Add task due date validation',
    description: 'Validate due dates and prevent invalid date input.',
  },
  {
    title: 'Create admin task management page',
    description: 'Admins should be able to view and manage all tasks.',
  },
  {
    title: 'Create employee task board',
    description: 'Employees should see their assigned tasks grouped by status.',
  },
  {
    title: 'Add recent activity widget',
    description: 'Show recently created tasks, updated statuses, and comments.',
  },
  {
    title: 'Write README task module section',
    description: 'Document task APIs, query params, and example request bodies.',
  },
  {
    title: 'Add API documentation examples',
    description: 'Add sample API requests and responses for task module.',
  },
  {
    title: 'Optimize task query includes',
    description: 'Avoid unnecessary joins and load only required attributes.',
  },
  {
    title: 'Create task unassign endpoint',
    description: 'Allow active assignment to be closed using unassigned_at.',
  },
  {
    title: 'Add completed task statistics',
    description: 'Count completed tasks for dashboard analytics.',
  },
  {
    title: 'Improve task permissions',
    description: 'Admin can manage all tasks, employees can manage tasks inside their projects.',
  },
  {
    title: 'Create task comments list',
    description: 'Display all comments for a task with commenter name and time.',
  },
  {
    title: 'Add task update tests',
    description: 'Test task update, validation errors, and unauthorized access.',
  },
  {
    title: 'Create task assignment tests',
    description: 'Test assigning project members and blocking non-members.',
  },
  {
    title: 'Add frontend notifications',
    description: 'Show success and error toast notifications for task actions.',
  },
  {
    title: 'Clean task module code',
    description: 'Refactor service methods and keep controller thin.',
  },
  {
    title: 'Prepare task module review notes',
    description: 'Write explanation notes for mentor review and live debugging.',
  },
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [projects] = await queryInterface.sequelize.query(`
      SELECT id, created_by_id
      FROM projects
      ORDER BY created_at ASC
    `);

    const [users] = await queryInterface.sequelize.query(`
      SELECT id
      FROM users
      ORDER BY created_at ASC
    `);

    if (!projects.length) {
      throw new Error('No projects found. Please run project seeders first.');
    }

    if (!users.length) {
      throw new Error('No users found. Please run user seeders first.');
    }

    const statuses = [TODO_STATUS_ID, IN_PROGRESS_STATUS_ID, COMPLETED_STATUS_ID];

    const tasks = taskTemplates.map((task, index) => {
      const project = projects[index % projects.length];
      const creatorId = project.created_by_id || users[index % users.length].id;

      return {
        id: taskId(index + 1),
        title: task.title,
        description: task.description,
        due_date: addDays((index % 30) + 1),
        status_id: statuses[index % statuses.length],
        project_id: project.id,
        created_by: creatorId,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert('tasks', tasks, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', {
      id: Array.from({ length: 50 }, (_, index) => taskId(index + 1)),
    });
  },
};
