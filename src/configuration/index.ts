export default () => ({
  port: process.env.PORT || 5000,
  adminUser: {
    fullName: process.env.ADMIN_USERNAME || 'fullName',
    username: process.env.ADMIN_USERNAME || 'username',
    password: process.env.ADMIN_PASSWORD || 'password',
    isAdmin: true,
  },
  mongodb: {
    uri: `mongodb://${process.env.DB_MONGO_USER || 'root'}:${
      process.env.DB_MONGO_PASSWORD || 'password'
    }@${process.env.DB_MONGO_HOST || 'localhost'}:${
      process.env.DB_MONGO_PORT || 27017
    }?directConnection=true`,
    retryAttempts: 5,
  },
  stripe: {
    options: { apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16' },
    apiKey: process.env.STRIPE_API_KEY || 'apiKey',
  },
  jwt: {
    secret: process.env.SECRET || 'payment',
    expire: process.env.EXPIRE || 86400,
  },
});
