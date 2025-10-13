import cors from 'cors';

const corsConfig = () => {
  return cors({
    origin: function (origin, callback) {
      const allowedOrigins =
        process.env.NODE_ENV === 'production'
          ? ['https://example.com']
          : ['http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-version'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Total-Count'],
    credentials: true,
    preflightContinue: false,
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
};

export default corsConfig;
