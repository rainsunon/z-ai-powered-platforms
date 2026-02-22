
export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  jurisdiction: string;
}

export interface Case {
  id: string;
  title: string;
  status: 'In Discovery' | 'Active' | 'Closed' | 'Archived';
  progress: number;
  lastUpdated: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
