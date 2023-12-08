export default () => ({
  port: process.env.PORT || 5000,
  feUrl: process.env.FE_URL || 'localhost:3000',
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
  },
  stripe: {
    options: { apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16' },
    apiKey: process.env.STRIPE_API_KEY || 'apiKey',
  },
  stripeCurrency: process.env.STRIPE_CURRENCY || 'usd',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'webhookSecret',
  jwt: {
    secret: process.env.SECRET || 'payment',
    expire: process.env.EXPIRE || 86400,
  },
});
