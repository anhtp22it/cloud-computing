import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, setToken } from "@store/slices/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseRaw = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state?.auth?.accessToken;
    const tokenType = state?.auth?.tokenType || "Bearer";
    if (token) headers.set("Authorization", `${tokenType} ${token}`);
    return headers;
  },
});

const getUrl = (args) => (typeof args === "string" ? args : args?.url || "");

const SKIP_REFRESH_PATHS = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/register",
];

export const baseQueryWithReauth = async (args, api, extra) => {
  await mutex.waitForUnlock();

  let res = await baseRaw(args, api, extra);
  const url = getUrl(args);

  if (
    res?.error &&
    res.error.status === 401 &&
    !SKIP_REFRESH_PATHS.some((p) => url.startsWith(p))
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refresh = await baseRaw(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extra,
        );

        if (refresh?.data) {
          api.dispatch(setToken(refresh.data));
          res = await baseRaw(args, api, extra);
        } else {
          api.dispatch(clearToken());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      res = await baseRaw(args, api, extra);
    }
  }

  return res;
};
