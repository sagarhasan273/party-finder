import { useLocation } from "react-router";
import { useRef, useEffect, useCallback } from "react";

import { useInventory, useCredentials } from "../core/slices";
import {
  useGetMyLobbyQuery,
  useGetLobbiesQuery,
  useGetJoinRequestedLobbiesQuery,
} from "../core/apis";

export const useLoadInventory = () => {
  const location = useLocation();

  const { isAuthenticated } = useCredentials();

  const {
    setLobbies,
    setMyLobby,
    setAppliedLobbies,
    setLoading,
    setMyLobbyLoading,
    setAppliedLobbiesLoading,
    reset: clearLobbies,
  } = useInventory();

  const lobbiesRef = useRef(false);
  const lobbyRef = useRef(false);
  const appliedLobbiesRef = useRef(false);

  const { data: lobby, isLoading: mylobbyLoading } = useGetMyLobbyQuery(null, {
    skip:
      !["/my-lobby", "/create"].includes(location?.pathname) ||
      !isAuthenticated,
  });

  const { data: appliedLobbies, isLoading: appliedLobbiesLoading } =
    useGetJoinRequestedLobbiesQuery(null, {
      skip: location?.pathname !== "/applied-lobbies" || !isAuthenticated,
    });

  const { data: lobbies, isLoading } = useGetLobbiesQuery(null, {
    skip: location?.pathname !== "/",
  });

  const getLobbies = useCallback(() => {
    try {
      if (lobbies && lobbies.status && !lobbiesRef.current) {
        setLobbies(lobbies.data || []);
        lobbiesRef.current = true;
      }
    } catch (error) {
      clearLobbies();
    }
  }, [lobbies, setLobbies, clearLobbies]);

  useEffect(() => {
    getLobbies();
  }, [getLobbies]);

  useEffect(() => {
    if (isAuthenticated && lobby && lobby.status && !lobbyRef.current) {
      setMyLobby(lobby.data || null);
      lobbyRef.current = true;
    }
  }, [isAuthenticated, lobby, setMyLobby]);

  useEffect(() => {
    if (
      isAuthenticated &&
      appliedLobbies &&
      appliedLobbies.status &&
      !appliedLobbiesRef.current
    ) {
      setAppliedLobbies(appliedLobbies.data || null);
      appliedLobbiesRef.current = true;
    }
  }, [isAuthenticated, appliedLobbies, setAppliedLobbies]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    setMyLobbyLoading(mylobbyLoading);
  }, [mylobbyLoading, setMyLobbyLoading]);

  useEffect(() => {
    setAppliedLobbiesLoading(appliedLobbiesLoading);
  }, [appliedLobbiesLoading, setAppliedLobbiesLoading]);
};
