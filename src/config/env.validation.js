const REQUIRED_ENV_VARS = ['JWT_SECRET'];

export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error('Server startup failed: missing required environment variables.');
    missing.forEach((key) => {
      console.error(`  - ${key}`);
    });
    console.error('\nCopy .env.example to .env and set the required values.');
    process.exit(1);
  }
};
