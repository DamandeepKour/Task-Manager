const tasks = [];
let idCounter = 1;

const isActive = (task) => !task.deletedAt;

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
    return tasks.find((task) => task.id === id && isActive(task)) || null;
  },

  findByUserId(userId) {
    return tasks.filter((task) => task.createdBy === userId && isActive(task));
  },

  findByUserIdWithFilters(userId, filters) {
    const { status, priority, search, sortBy, order, page, limit } = filters;

    let result = tasks.filter((task) => task.createdBy === userId && isActive(task));

    if (status) {
      result = result.filter((task) => task.status === status);
    }

    if (priority) {
      result = result.filter((task) => task.priority === priority);
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';

      let comparison = 0;

      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'dueDate') {
        comparison = new Date(aVal || 0) - new Date(bVal || 0);
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return order === 'asc' ? comparison : -comparison;
    });

    const total = result.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = result.slice(offset, offset + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  update(id, updates) {
    const taskIndex = tasks.findIndex((task) => task.id === id && isActive(task));

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
    const taskIndex = tasks.findIndex((task) => task.id === id && isActive(task));

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
