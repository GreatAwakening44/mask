export interface Post {
  id: string;
  content: string;
  timestamp: number;
  likes: number;
  liked: boolean;
  replies: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  timestamp: number;
}

export interface Space {
  id: string;
  posts: Post[];
  createdAt: number;
  expiresAt: number;
  isHost: boolean;
  lastMessage?: string;
  messageCount?: number;
}
