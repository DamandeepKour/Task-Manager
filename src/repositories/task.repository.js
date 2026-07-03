import { TASK_DATE_SORT_FIELDS } from '../constants/task.constants.js';

const tasks = [];
let idCounter = 1;

const isActive = (task) => !task.deletedAt;

const matchesFilters = (task, userId, filters) => {
  if (task.createdBy !== userId || !isActive(task)) {
    return false;
  }

  if (filters.status && task.status !== filters.status) {
    return false;
  }

  if (filters.priority && task.priority !== filters.priority) {
    return false;
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    const inTitle = task.title.toLowerCase().includes(term);
    const inDescription = task.description.toLowerCase().includes(term);

    if (!inTitle && !inDescription) {
      return false;
    }
  }

  return true;
};

const compareTasks = (a, b, sortBy, order) => {
  const aVal = a[sortBy] ?? '';
  const bVal = b[sortBy] ?? '';

  let comparison = 0;

  if (TASK_DATE_SORT_FIELDS.includes(sortBy)) {
    comparison = new Date(aVal || 0) - new Date(bVal || 0);
  } else {
    comparison = String(aVal).localeCompare(String(bVal));
  }

  return order === 'asc' ? comparison : -comparison;
};

const findActiveTaskIndex = (id) =>
  tasks.findIndex((task) => task.id === id && isActive(task));

const taskRepository = {
  create(taskData) {
    const now = new Date().toISOString();
    const task = {
      id: idCounter++,
      ...taskData,
      deletedAt: null,
      deletedBy: null,
      createdAt: now,
      updatedAt: now,
      updatedBy: taskData.updatedBy ?? taskData.createdBy,
    };

    tasks.push(task);
    return task;
  },

  findById(id) {
    const task = tasks.find((taskItem) => taskItem.id === id && isActive(taskItem));
    return task || null;
  },

  findByUserId(userId) {
    return tasks.filter((task) => matchesFilters(task, userId, {}));
  },

  findByUserIdWithFilters(userId, filters) {
    const { sortBy, order, page, limit } = filters;

    const result = tasks
      .filter((task) => matchesFilters(task, userId, filters))
      .sort((a, b) => compareTasks(a, b, sortBy, order));

    const total = result.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    return {
      data: result.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  update(id, updates) {
    const taskIndex = findActiveTaskIndex(id);

    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  softDelete(id, auditFields) {
    const taskIndex = findActiveTaskIndex(id);

    if (taskIndex === -1) {
      return null;
    }

    const now = new Date().toISOString();
    const deletedTask = {
      ...tasks[taskIndex],
      deletedAt: now,
      deletedBy: auditFields.deletedBy,
      updatedAt: now,
      updatedBy: auditFields.updatedBy,
    };

    tasks[taskIndex] = deletedTask;
    return deletedTask;
  },

  reset() {
    tasks.length = 0;
    idCounter = 1;
  },
};

export default taskRepository;
