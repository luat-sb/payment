export default () => ({
  port: process.env.PORT || 5000,
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
