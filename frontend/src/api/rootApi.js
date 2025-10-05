import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Events",
    "AllEvents",
    "ManagedEvents",
    "AllManagedEvents",
    "EventManager",
    "Units",
    "Users",
    "Roles",
  ],

  endpoints: () => ({}),
});
