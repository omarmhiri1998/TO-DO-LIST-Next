"use client";

import {
  useEffect
} from "react";

import {
  refreshAccessTokenAction
} from "../app/actions/authActions";

export default function SessionRefresh() {
  useEffect(() => {
    async function refreshToken() {
      try {
        await refreshAccessTokenAction();
      } catch {
        // No active session.
      }
    }

    refreshToken();

    const interval =
      window.setInterval(
        refreshToken,
        10 * 60 * 1000
      );

    function handleVisibility() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refreshToken();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.clearInterval(
        interval
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  return null;
}