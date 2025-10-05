import { rootApi } from './rootApi';

export const pollApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPollsByEvent: builder.query({
      query: (eventId) => `/polls/events/${eventId}`,
      providesTags: (result, error, eventId) => [{ type: 'Polls', id: eventId }],
    }),
    getPoll: builder.query({
      query: (pollId) => `/polls/${pollId}`,
      providesTags: (result, error, pollId) => [{ type: 'Poll', id: pollId }],
    }),
    getMyVotedOptions: builder.query({
      query: (pollId) => `/polls/${pollId}/my-options`,
      providesTags: (result, error, pollId) => [{ type: 'MyVotedOptions', id: pollId }],
    }),
    votePoll: builder.mutation({
      query: ({ pollId, optionIds }) => ({
        url: `/polls/${pollId}/vote`,
        method: 'POST',
        body: { option_ids: optionIds },
      }),
      invalidatesTags: (result, error, { pollId }) => [
        { type: 'Poll', id: pollId },
        { type: 'Polls' },
      ],
    }),
    createPoll: builder.mutation({
      query: (newPoll) => ({
        url: `/polls`,
        method: 'POST',
        body: newPoll,
      }),
    }),
    closePoll: builder.mutation({
      query: (pollId) => ({
        url: `/polls/${pollId}/close`,
        method: 'PUT',
      }),
    }),
    updatePoll: builder.mutation({
      query: ({ pollId, updatedPoll }) => ({
        url: `/polls/${pollId}`,
        method: 'PUT',
        body: updatedPoll,
      }),
    }),
    getPollStatByEventId: builder.query({
      query: (eventId) => ({
        url: `/polls/${eventId}/stats`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPollsByEventQuery,
  useGetPollQuery,
  useVotePollMutation,
  useGetMyVotedOptionsQuery,
  useCreatePollMutation,
  useClosePollMutation,
  useUpdatePollMutation,
  useGetPollStatByEventIdQuery,
} = pollApi;
