import type { ReactNode } from 'react';

export type StatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  className: string;
  onClick?: () => void | Promise<void>;
};

export type LiveFeedItem = {
  user: string;
  avatar: string;
  dataAiHint?: string;
  action: string;
  subject: string;
  time: string;
};
