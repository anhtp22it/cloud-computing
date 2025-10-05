import { fetchEventSource } from "@microsoft/fetch-event-source";
import { rootApi } from "./rootApi";

export const attendantApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getParticipantsByEvent: builder.query({
      query: (eventId) => `attendants/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Attendants", id: eventId },
      ],
      async onCacheEntryAdded(
        eventId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        await cacheDataLoaded;

        const token = getState().auth.accessToken;

        if (!token) {
          console.error("SSE Connection: No token found.");
          return;
        }

        const controller = new AbortController();

        fetchEventSource(
          `${import.meta.env.VITE_BASE_URL}/attendants/subscribe/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,

            onmessage(event) {
              if (event.event === "participant-checked-in") {
                const updatedParticipant = JSON.parse(event.data);
                updateCachedData((draft) => {
                  const participant = draft.find(
                    (p) => p.user.id === updatedParticipant.user.id,
                  );
                  if (participant) {
                    participant.check_in_time =
                      updatedParticipant.check_in_time;
                  }
                });
              }
            },
            onerror(err) {
              console.error("EventSource failed:", err);
              throw err;
            },
          },
        );

        await cacheEntryRemoved;
        controller.abort();
      },
    }),
    addParticipants: builder.mutation({
      query: ({ eventId, emails }) => ({
        url: `events/${eventId}/participants`,
        method: "POST",
        body: { emails },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),
    deleteParticipant: builder.mutation({
      query: ({ eventId, userId }) => ({
        url: `attendants/${eventId}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),
    checkInEvent: builder.mutation({
      query: ({ eventToken }) => ({
        url: `attendants/check-in/${eventToken}`,
        method: "POST",
      }),
    }),
    getEventQR: builder.query({
      query: (id) => ({
        url: `/attendants/get-qr-check/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    deleteParticipants: builder.mutation({
      query: ({ eventId, emails }) => ({
        url: `events/${eventId}/participants`,
        method: "DELETE",
        body: { emails },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),
    cancelMyRegistration: builder.mutation({
      query: (eventId) => ({
        url: `attendants/my-registration/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Events", id: eventId },
        "Events",
        "AllEvents",
        "ManagedEvents",
        "AllManagedEvents",
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetParticipantsByEventQuery,
  useAddParticipantsMutation,
  useDeleteParticipantMutation,
  useCheckInEventMutation,
  useGetEventQRQuery,
  useDeleteParticipantsMutation,
  useCancelMyRegistrationMutation,
} = attendantApi;
