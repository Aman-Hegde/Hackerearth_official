// import authRoutes from './routes/auth';
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (_req: Request, res: Response) => {
//   res.send('Welcome to my API');
// });

// app.get('/api/health', (_req: Request, res: Response) => {
//   res.send('API is running');
// });

// app.use('/auth', authRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import authRoutes from './routes/auth';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ API route for health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.send('API is running');
});

// ✅ Auth routes
app.use('/auth', authRoutes);

// ✅ Serve frontend (React build)
const frontendPath = path.join(__dirname, '../client/dist'); // change if using CRA -> '../client/build'
app.use(express.static(frontendPath));

// ✅ Catch-all: send index.html for React Router routes

app.get('/*', (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

