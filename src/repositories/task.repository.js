const tasks = [];
let idCounter = 1;

const taskRepository = {
  create(taskData) {
    const now = new Date().toISOString();
    const task = {
      id: idCounter++,
      ...taskData,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(task);
    return task;
  },

  findById(id) {
    return tasks.find((task) => task.id === id) || null;
  },

  findByUserId(userId) {
    return tasks.filter((task) => task.createdBy === userId);
  },

  update(id, updates) {
    const taskIndex = tasks.findIndex((task) => task.id === id);

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

  delete(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return false;
    }

    tasks.splice(taskIndex, 1);
    return true;
  },
};

export default taskRepository;
