import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user';

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/google', async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'ID token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || payload.hd !== 'nmamit.in') {
      return res.status(403).json({ error: 'Unauthorized domain' });
    }

    const email = payload.email;
    const googleId = payload.sub;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email or Google ID missing from token' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Access denied: Email not authorized' });
    }

    if (user.google_id !== googleId) {
      user.google_id = googleId;
      await user.save();
    }

    res.json({ message: 'Access granted', email: user.email, google_id: user.google_id });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

export default router;
