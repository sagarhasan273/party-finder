import React, { useRef, useState } from "react";

import { Box, Grid, Container } from "@mui/material";

import { Header } from "./layout/header";
import { useToast } from "../../hooks/use-toast";
import { useAudio } from "../../hooks/use-audio";
import { useGemini } from "../../hooks/use-gemimi";
import { playPingSound } from "../../utils/helpers";
import { LayoutGuide } from "./layout/layout-guide";
import { MOCK_PLAYERS, AGENT_SYSTEM_PROMPTS } from "../../utils/constants";
import { PlayerList } from "../../sections/section-social/players/player-list";
import { ProfileCard } from "../../sections/section-social/profile/profile-card";
import { FilterPanel } from "../../sections/section-social/filters/filter-panel";
import { PartyInvites } from "../../sections/section-social/party/party-invites";
import { TacticalCoach } from "../../sections/section-social/coach/tactical-coach";
import { ProfileGenerator } from "../../sections/section-social/profile/profile-generator";
import { NotificationSystem } from "../../sections/section-social/common/notification-system";

export function SocialPage() {
  // State
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [myParty, setMyParty] = useState<any[]>([]);
  const [sentInvites, setSentInvites] = useState<string[]>([]);
  const [incomingInvites, setIncomingInvites] = useState<any[]>([
    {
      id: "inc-1",
      sender: {
        id: "pl-3",
        username: "LineupLarry",
        tagline: "LFG",
        rank: "Ascendant 2",
        rankTier: "ascendant",
        rankIcon: "⚔️",
        status: "searching",
        mainAgent: "Sova",
        role: "Initiator",
        lookingFor: "Looking for a solid competitive stack.",
        partySize: 4,
        partyMax: 5,
        microphone: true,
        languages: ["ENG"],
        personality: "Competitive player looking to build a consistent team.",
      },
      message: "Join my stack of 4! Need one anchor.",
      time: "Just now",
    },
  ]);
  const [expandedChats, setExpandedChats] = useState<Record<string, boolean>>({
    "pl-1": true,
  });
  const [messages, setMessages] = useState<Record<string, any[]>>({
    "pl-1": [
      {
        id: "m1",
        sender: "them",
        text: "Hey! Looking to grind some Radiant rating today. What roles do you play?",
        timestamp: "1:40 AM",
      },
    ],
    "pl-2": [
      {
        id: "m1",
        sender: "them",
        text: "Hello! I am a Sage main. Ready to support and heal. Want to team up?",
        timestamp: "1:38 AM",
      },
    ],
  });
  const [inputMessages, setInputMessages] = useState<Record<string, string>>(
    {},
  );
  const [chatThinkingStatus, setChatThinkingStatus] = useState<
    Record<string, boolean>
  >({});
  const [showLayoutGuide, setShowLayoutGuide] = useState(true);
  const [showProfileGenerator, setShowProfileGenerator] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    rank: "All",
    role: "All",
    mode: "All",
    micRequired: false,
  });
  const [myProfile, setMyProfile] = useState({
    username: "RadiantGamer",
    tagline: "VAL",
    rank: "Immortal 1",
    rankIcon: "👑",
    role: "Duelist/Initiator",
    status: "LFG ACTIVE",
    isSearching: true,
    partySize: 1,
    partyMax: 5,
    winRate: "62.4%",
    headshotRate: "24.8%",
    favoriteMap: "Ascent",
    clutchWon: "74",
    avatarUrl: null as string | null,
    bio: "Looking for top tier teammates to climb to Radiant. Can play Jett, Sova, or Omen.",
  });

  // Hooks
  const { toasts, addToast, removeToast } = useToast();
  const { soundEnabled, toggleSound } = useAudio();
  const {
    generateText,
    generateImage,
    isLoading: isGeminiLoading,
  } = useGemini();
  const cardChatRefs = useRef<Record<string, HTMLDivElement>>({});

  // Helper functions
  const scrollToCardChatBottom = (playerId: string) => {
    setTimeout(() => {
      const el = cardChatRefs.current[playerId];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  };

  const handleCardSendMessage = async (playerId: string, textOverride = "") => {
    const activeInput = textOverride || inputMessages[playerId] || "";
    if (!activeInput.trim()) return;

    const userMsg = activeInput;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg = {
      id: `user-${Date.now()}`,
      sender: "me" as const,
      text: userMsg,
      timestamp,
    };
    setMessages((prev) => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), newMsg],
    }));

    setInputMessages((prev) => ({ ...prev, [playerId]: "" }));
    scrollToCardChatBottom(playerId);

    if (soundEnabled) playPingSound();

    setChatThinkingStatus((prev) => ({ ...prev, [playerId]: true }));

    const systemPrompt =
      AGENT_SYSTEM_PROMPTS[playerId] ||
      "You are an online Valorant LFG player. Reply casually with gamer slang, 1 line max.";

    try {
      const currentHistory = messages[playerId] || [];
      const historyPrompt = `${currentHistory.map((m) => `${m.sender === "me" ? "User" : "Agent"}: ${m.text}`).join("\n")}\nUser: ${userMsg}\nAgent:`;

      const reply = await generateText(historyPrompt, systemPrompt);
      const cleanedReply = reply
        .replace(/^(Agent:\s*|AgentFuel:\s*)/i, "")
        .trim();

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "them" as const,
        text:
          cleanedReply ||
          "Ping looks slightly high right now. Let's lock in and play!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => ({
        ...prev,
        [playerId]: [...(prev[playerId] || []), botMsg],
      }));

      const replyingPlayer = players.find((p) => p.id === playerId);
      if (replyingPlayer) {
        addToast(`Message from ${replyingPlayer.username}`, "message");
      }
    } catch (e) {
      const fallbackMsg = {
        id: `bot-fallback-${Date.now()}`,
        sender: "them" as const,
        text: "Spike lag on my side! Send that party invite, I am loading into the client.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => ({
        ...prev,
        [playerId]: [...(prev[playerId] || []), fallbackMsg],
      }));
    } finally {
      setChatThinkingStatus((prev) => ({ ...prev, [playerId]: false }));
      scrollToCardChatBottom(playerId);
    }
  };

  const handleInviteToParty = (player: any) => {
    if (sentInvites.includes(player.id)) {
      addToast(`Invitation to ${player.username} is pending!`, "warning");
      return;
    }

    setSentInvites((prev) => [...prev, player.id]);
    addToast(`Lobby invitation broadcasted to ${player.username}!`, "success");

    setTimeout(() => {
      setSentInvites((prev) => prev.filter((id) => id !== player.id));

      setMyParty((prev) => {
        if (prev.find((p) => p.id === player.id)) return prev;
        return [...prev, player];
      });

      setMyProfile((prev) => ({
        ...prev,
        partySize: Math.min(5, prev.partySize + 1),
      }));

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === player.id) {
            return {
              ...p,
              status: "in-party",
              lookingFor: "Joined RadiantGamer's squad",
            };
          }
          return p;
        }),
      );

      addToast(`${player.username} joined your active party!`, "success");
    }, 4000);
  };

  const toggleChatExpand = (playerId: string) => {
    setExpandedChats((prev) => {
      const isCurrentlyExpanded = !!prev[playerId];
      const nextState = { ...prev, [playerId]: !isCurrentlyExpanded };
      if (!isCurrentlyExpanded) {
        scrollToCardChatBottom(playerId);
      }
      return nextState;
    });
  };

  const simulateNewUserJoiningGlobal = () => {
    const names = [
      "SovaArrow",
      "OmenTP",
      "PhoenixFlames",
      "NeonDash",
      "FadeClaw",
      "ChamberGold",
    ];
    const ranks = [
      "Gold 3",
      "Platinum 1",
      "Diamond 3",
      "Immortal 1",
      "Radiant",
    ];
    const roles = [
      "Initiator",
      "Controller",
      "Duelist",
      "Duelist",
      "Initiator",
      "Sentinel",
    ];
    const agents = ["Sova", "Omen", "Phoenix", "Neon", "Fade", "Chamber"];

    const randomIdx = Math.floor(Math.random() * names.length);
    const id = `pl-custom-${Date.now()}`;
    const newPlayer = {
      id,
      username: names[randomIdx],
      tagline: "LFG",
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      rankTier: "diamond",
      rankIcon: "🛡️",
      status: "searching",
      mainAgent: agents[randomIdx],
      role: roles[randomIdx],
      lookingFor: "Looking for fast games! Unrated or swiftplay.",
      partySize: 1,
      partyMax: 5,
      microphone: Math.random() > 0.3,
      languages: ["ENG"],
      personality:
        "Active competitive player looking to coordinate lineups and play swift matches.",
    };

    setPlayers((prev) => [newPlayer, ...prev]);
    addToast(`${newPlayer.username} tagged themselves as LFG Active!`, "info");
  };

  const simulateIncomingInvite = () => {
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    const newInvite = {
      id: `inc-${Date.now()}`,
      sender: randomPlayer,
      message: `Hey! We need one more ${randomPlayer.role} player. Join up!`,
      time: "Just now",
    };
    setIncomingInvites((prev) => [newInvite, ...prev]);
    addToast(
      `Received party invitation from ${randomPlayer.username}!`,
      "invite",
    );
  };

  const handleGenerateStrategy = async (map: string) => {
    const partyMembers = myParty
      .map((p) => `${p.username} (${p.mainAgent} - ${p.role})`)
      .join(", ");
    const teamSummary = `${myProfile.username} (${myProfile.role})${partyMembers ? `, plus: ${partyMembers}` : ""}`;

    const coachPrompt = `Create a brief, highly operational tactical execution layout for map: ${map}. Our current squad consists of these active agents: ${teamSummary}.
Provide:
1. One key Site Attack strategy tailored to our agents' abilities.
2. One key Retake or Defensive hold strategy.
Limit the response to 3-4 bullet points max, using clean bullet styling and professional esports terms. Keep it short and readable in a dashboard view.`;

    const result = await generateText(
      coachPrompt,
      "You are VCT-Coach, a world-class professional Valorant analyst. You give razor-sharp, elite map tactics based on team composition.",
    );
    return (
      result ||
      "Failed to reach tactical satellite. Please verify connection and retry."
    );
  };

  const handleGenerateProfile = async (data: {
    agent: string;
    playstyle: string;
    prompt: string;
  }) => {
    const imageResult = await generateImage(data.prompt);
    const bioPrompt = `Write a clean, attractive Valorant player LFG bio for my profile. My preferred agent is ${data.agent} and my style is ${data.playstyle}. Use modern Valorant gaming slang. Keep it under 15 words.`;
    const bioResult = await generateText(
      bioPrompt,
      "You write concise, snappy, clever gaming LFG bios.",
    );

    const wr = `${(55 + Math.random() * 12).toFixed(1)}%`;
    const hs = `${(18 + Math.random() * 15).toFixed(1)}%`;

    setMyProfile((prev) => ({
      ...prev,
      username: `${data.agent}Main`,
      role: `${data.agent} / flex`,
      winRate: wr,
      headshotRate: hs,
      bio: bioResult.replace(/['"]/g, "").trim() || prev.bio,
      avatarUrl: imageResult || prev.avatarUrl,
    }));

    addToast("AI stylized Profile loaded into the mainframe!", "success");
    setShowProfileGenerator(false);
  };

  const acceptInvite = (invite: any) => {
    addToast(
      `Accepted party invite from ${invite.sender.username}!`,
      "success",
    );
    setMyParty((prev) => [...prev, invite.sender]);
    setMyProfile((prev) => ({ ...prev, partySize: prev.partySize + 1 }));
    setIncomingInvites((prev) => prev.filter((x) => x.id !== invite.id));
  };

  const declineInvite = (inviteId: string) => {
    const invite = incomingInvites.find((i) => i.id === inviteId);
    if (invite) {
      addToast(`Declined invitation from ${invite.sender.username}.`, "info");
    }
    setIncomingInvites((prev) => prev.filter((x) => x.id !== inviteId));
  };

  // Filter players
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      player.mainAgent.toLowerCase().includes(filters.search.toLowerCase()) ||
      player.role.toLowerCase().includes(filters.search.toLowerCase());

    let matchesRank = true;
    if (filters.rank !== "All") {
      const lowerRank = player.rank.toLowerCase();
      const targetRank = filters.rank.toLowerCase();
      if (targetRank === "immortal+") {
        matchesRank =
          lowerRank.includes("immortal") || lowerRank.includes("radiant");
      } else {
        matchesRank = lowerRank.includes(targetRank);
      }
    }

    const matchesRole = filters.role === "All" || player.role === filters.role;
    const matchesMic = !filters.micRequired || player.microphone;

    return matchesSearch && matchesRank && matchesRole && matchesMic;
  });

  // Player state helpers
  const isInParty = (id: string) => myParty.some((p) => p.id === id);
  const isInvitePending = (id: string) => sentInvites.includes(id);
  const isChatExpanded = (id: string) => !!expandedChats[id];

  const getChatProps = (playerId: string) => ({
    messages: messages[playerId] || [],
    inputMessage: inputMessages[playerId] || "",
    onInputChange: (value: string) =>
      setInputMessages((prev) => ({ ...prev, [playerId]: value })),
    onSendMessage: () => handleCardSendMessage(playerId),
    isThinking: !!chatThinkingStatus[playerId],
    onQuickPhrase: (phrase: string) => handleCardSendMessage(playerId, phrase),
  });

  return (
    <Box sx={{ bgcolor: "#060a0f", minHeight: "100vh" }}>
      <NotificationSystem toasts={toasts} onRemove={removeToast} />

      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onSimulatePlayer={simulateNewUserJoiningGlobal}
        onSimulateInvite={simulateIncomingInvite}
      />

      {showLayoutGuide && (
        <LayoutGuide onClose={() => setShowLayoutGuide(false)} />
      )}

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Profile Section */}
        <Box sx={{ mb: 4 }}>
          <ProfileCard
            profile={myProfile}
            partyCount={myParty.length}
            onEditProfile={() => setShowProfileGenerator(true)}
          />
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Sidebar - Filters */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FilterPanel
                filters={filters}
                onFilterChange={(key, value) =>
                  setFilters((prev) => ({ ...prev, [key]: value }))
                }
                onReset={() =>
                  setFilters({
                    search: "",
                    rank: "All",
                    role: "All",
                    mode: "All",
                    micRequired: false,
                  })
                }
              />

              <TacticalCoach
                onGenerateStrategy={handleGenerateStrategy}
                isLoading={isGeminiLoading}
              />

              <PartyInvites
                invites={incomingInvites}
                onAccept={acceptInvite}
                onDecline={declineInvite}
                onClearAll={() => setIncomingInvites([])}
              />
            </Box>
          </Grid>

          {/* Right Content - Player List */}
          <Grid size={{ xs: 12, lg: 9 }}>
            <PlayerList
              players={filteredPlayers}
              playerStates={{ isInParty, isInvitePending, isChatExpanded }}
              onToggleChat={toggleChatExpand}
              onInvite={handleInviteToParty}
              chatProps={getChatProps}
            />
          </Grid>
        </Grid>
      </Container>

      <ProfileGenerator
        open={showProfileGenerator}
        onClose={() => setShowProfileGenerator(false)}
        onGenerate={handleGenerateProfile}
        isLoading={isGeminiLoading}
      />
    </Box>
  );
}
