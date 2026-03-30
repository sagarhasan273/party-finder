import { useEffect, useCallback } from "react";

import { useInventory } from "src/core/slices";
import { useGetLobbiesQuery } from "src/core/apis";

export const useLobbies = () => {
  const { setLobbies, reset: clearLobbies } = useInventory();

  const { data } = useGetLobbiesQuery(null);

  const getLobbies = useCallback(async () => {
    try {
      if (data && data.status) {
        setLobbies(data.data || []);
      }
    } catch (error) {
      clearLobbies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    getLobbies();
  }, [getLobbies]);
};
