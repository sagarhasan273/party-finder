import { useEffect, useCallback } from "react";

import AXIOS, { endpoints } from "src/utils/axios";

import { useInventory } from "src/core/slices";

export const useLobbies = () => {
  const { setLobbies, reset: clearLobbies } = useInventory();

  const getLobbies = useCallback(async () => {
    try {
      const res = await AXIOS.get(endpoints.inventory.lobbies);

      const { data, status } = res.data;
      if (status) {
        setLobbies(data || []);
      }
    } catch (error) {
      clearLobbies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getLobbies();
  }, [getLobbies]);
};
