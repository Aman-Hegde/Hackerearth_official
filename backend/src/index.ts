import authRoutes from './routes/auth';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();


app.use(cors({
  origin: 'https://hackerearth-official.onrender.com/login', // front-end URL
  credentials: true, // allow cookies to be sent in cross-origin requests
}));

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to my API');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.send('API is running');
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



