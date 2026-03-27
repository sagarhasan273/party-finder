// src/contexts/LobbyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lobby } from '../types';

const mockLobbies: Lobby[] = [
  { id: 1, host: "NightSabre", tag: "#EU1", rank: "Gold", rankNum: 2, style: "chill", region: "EU", role: "Controller / Smokes", desc: "Gold 4-stack, been playing together for weeks. Need a smokes main to complete the lineup.", players: ["NS", "AK", "FL", "RZ"], time: "2 min ago", rankClass: "rank-gold", tagClass: "tag-gold" },
  { id: 2, host: "VelocityX", tag: "#NA1", rank: "Platinum", rankNum: 2, style: "comp", region: "NA", role: "Sentinel", desc: "Plat 2–3 group, 4KD avg. Looking for a Killjoy or Cypher for anchor duty. Voice required.", players: ["VX", "QT", "SR", "MW"], time: "5 min ago", rankClass: "rank-plat", tagClass: "tag-plat" },
  { id: 3, host: "StarlightK", tag: "#KR1", rank: "Diamond", rankNum: 1, style: "comp", region: "KR", role: "Duelist", desc: "Diamond lobbies, need an entry fragger. English OK. Discord required.", players: ["SK", "JH", "MP", "LS"], time: "8 min ago", rankClass: "rank-diamond", tagClass: "tag-diamond" },
  { id: 4, host: "CasualCarl", tag: "#NA2", rank: "Silver", rankNum: 3, style: "chill", region: "NA", role: "Any Role", desc: "Silver homies just having fun. No pressure, good vibes only. Mic optional.", players: ["CC", "BD", "TY"], time: "11 min ago", rankClass: "rank-silver", tagClass: "tag-silver" },
  { id: 5, host: "IronLord", tag: "#BR1", rank: "Iron", rankNum: 3, style: "chill", region: "BR", role: "Any Role", desc: "Iron stack learning the ropes together. Portuguese/English fine. Very chill.", players: ["IL", "MF"], time: "15 min ago", rankClass: "rank-iron", tagClass: "tag-iron" },
  { id: 6, host: "BronzeFist", tag: "#EU2", rank: "Bronze", rankNum: 1, style: "mid", region: "EU", role: "Initiator / Flash", desc: "Bronze 4-stack weekend warriors. Need a flash/info gatherer.", players: ["BF", "GH", "LK", "PO"], time: "19 min ago", rankClass: "rank-bronze", tagClass: "tag-bronze" },
  { id: 7, host: "RadiantOne", tag: "#NA3", rank: "Radiant", rankNum: 0, style: "comp", region: "NA", role: "Duelist", desc: "Radiant premade. Serious only. If you're not cracked don't apply.", players: ["R1", "TX", "YZ", "KW"], time: "22 min ago", rankClass: "rank-radiant", tagClass: "tag-radiant" },
  { id: 8, host: "SilverSurge", tag: "#AP1", rank: "Silver", rankNum: 1, style: "mid", region: "AP", role: "Controller / Smokes", desc: "AP Silver 4-stack, mostly afternoon games. Looking for a smokes player.", players: ["SS", "NL", "QP", "VH"], time: "30 min ago", rankClass: "rank-silver", tagClass: "tag-silver" },
];

interface LobbyContextType {
  lobbies: Lobby[];
  filter: string;
  setFilter: (filter: string) => void;
  joinLobby: (id: number) => void;
  postLobby: (lobby: Omit<Lobby, 'id' | 'time' | 'rankClass' | 'tagClass'>) => void;
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lobbies, setLobbies] = useState<Lobby[]>(mockLobbies);
  const [filter, setFilter] = useState('all');

  const joinLobby = (id: number) => {
    const lobby = lobbies.find(l => l.id === id);
    if (lobby?.rank === 'Radiant') {
      // Show warning handled by toast
    }
  };

  const postLobby = (lobbyData: Omit<Lobby, 'id' | 'time' | 'rankClass' | 'tagClass'>) => {
    const newLobby: Lobby = {
      ...lobbyData,
      id: lobbies.length + 1,
      time: 'Just now',
      rankClass: `rank-${lobbyData.rank.toLowerCase()}`,
      tagClass: `tag-${lobbyData.rank.toLowerCase()}`,
    };
    setLobbies(prev => [newLobby, ...prev]);
  };

  return (
    <LobbyContext.Provider value={{ lobbies, filter, setFilter, joinLobby, postLobby }}>
      {children}
    </LobbyContext.Provider>
  );
};

export const useLobby = () => {
  const context = useContext(LobbyContext);
  if (!context) {
    throw new Error('useLobby must be used within LobbyProvider');
  }
  return context;
};