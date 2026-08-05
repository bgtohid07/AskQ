import { User, Question, Reply, Notification, BlockedUser, Report, Follow } from '@prisma/client'

export type UserProfile = User & {
  _count: {
    followers: number;
    following: number;
    receivedQuestions: number;
  };
  isFollowing?: boolean;
}

export type QuestionWithSender = Question & {
  sender: Pick<User, 'id' | 'name' | 'username' | 'profilePicture'>;
}

export type QuestionWithReply = Question & {
  reply: Reply | null;
  sender: Pick<User, 'id' | 'name' | 'username' | 'profilePicture'>;
}

export type ReplyWithUser = Reply & {
  user: Pick<User, 'id' | 'name' | 'username' | 'profilePicture'>;
}

export type NotificationType = 'NEW_QUESTION' | 'NEW_REPLY' | 'NEW_FOLLOWER';

export interface AppNotification extends Notification {
  type: NotificationType;
}
