import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description:
        'RESTful API for managing tasks with JWT authentication. Built with Node.js and Express.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 8, example: 'password123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Complete project' },
            description: { type: 'string', example: 'Finish the API documentation' },
            status: {
              type: 'string',
              enum: ['Todo', 'In Progress', 'Completed'],
              example: 'Todo',
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'Medium',
            },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            createdBy: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Complete project' },
            description: { type: 'string', example: 'Finish the API documentation' },
            status: {
              type: 'string',
              enum: ['Todo', 'In Progress', 'Completed'],
              example: 'Todo',
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'Medium',
            },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Updated title' },
            description: { type: 'string', example: 'Updated description' },
            status: {
              type: 'string',
              enum: ['Todo', 'In Progress', 'Completed'],
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
            },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 45 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        PaginatedTasksResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Tasks fetched successfully' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Task' },
            },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
