export const ENV = {
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CONNECTION_URL: process.env.CONNECTION_URL,
  MAIL_EMAIL: process.env.MAIL_EMAIL,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_SECRET_KEY: process.env.GOOGLE_OAUTH_SECRET_KEY,
  GOOGLE_OAUTH_REDIRECT_URL: process.env.GOOGLE_OAUTH_REDIRECT_URL,
};

export function validateEnv() {
  console.log('ENV', ENV);

  const nulledKeys = [];

  for (const [k, v] of Object.entries(ENV)) {
    if (!v) nulledKeys.push(k);
  }

  if (nulledKeys.length > 0) {
    console.log(nulledKeys);
  }

  return nulledKeys.length == 0;
}
