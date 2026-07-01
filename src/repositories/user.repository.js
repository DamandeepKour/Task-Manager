const users = [];
let idCounter = 1;

const userRepository = {
  create({ name, email, password }) {
    const user = {
      id: idCounter++,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    return user;
  },

  findByEmail(email) {
    return users.find((user) => user.email === email) || null;
  },

  findById(id) {
    return users.find((user) => user.id === id) || null;
  },

  reset() {
    users.length = 0;
    idCounter = 1;
  },
};

export default userRepository;
