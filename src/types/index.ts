// src/types/index.ts
export interface Player {
  id: string;
  name: string;
  tag: string;
  rank: string;
  rankNum: number;
  region: string;
  role: string;
  style: 'chill' | 'mid' | 'comp';
  agents: string[];
  matches: number;
  winRate: string;
  karma: number;
  labels: string[];
  online: boolean;
  avatarInitials: string;
}

export interface Lobby {
  id: number;
  host: string;
  tag: string;
  rank: string;
  rankNum: number;
  style: 'chill' | 'mid' | 'comp';
  region: string;
  role: string;
  desc: string;
  players: string[];
  time: string;
  rankClass: string;
  tagClass: string;
}

export interface Friend {
  name: string;
  tag: string;
  rank: string;
  status: string;
  online: boolean;
}

export interface UserProfile {
  riotId: string;
  region: string;
  rank: string;
  rr: number;
  peakRank: string;
  winRate: string;
  mainRole: string;
  playstyle: 'chill' | 'mid' | 'comp';
  mainAgents: string[];
  bio: string;
  discord: string;
  tracker: string;
}

export interface ToastMessage {
  id: string;
  icon: 'success' | 'warning' | 'info';
  message: string;
}