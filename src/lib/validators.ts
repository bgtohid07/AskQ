import { z } from 'zod';

export const registerSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

export const askQuestionSchema = z.object({
  senderName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .transform((str) => str.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")), // Basic HTML sanitization
  content: z.string()
    .min(1, 'Question cannot be empty')
    .max(500, 'Question too long')
    .transform((str) => str.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")), // Basic HTML sanitization
  receiverUsername: z.string().min(1, 'Receiver username is required'),
});

export const replySchema = z.object({
  content: z.string().min(1, 'Reply cannot be empty').max(1000, 'Reply too long'),
  isPublic: z.boolean().default(true),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  bio: z.string().max(160).optional().nullable(),
  profilePicture: z.string().url().optional().nullable(),
  acceptQuestions: z.boolean().optional(),
});

export const reportSchema = z.object({
  reportedId: z.string().min(1, 'Reported user ID is required'),
  reason: z.string().min(1, 'Reason is required'),
  details: z.string().optional(),
});
