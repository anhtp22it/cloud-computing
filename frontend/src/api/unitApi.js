import { rootApi } from './rootApi';

export const unitApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    listUnits: builder.query({
      query: ({ q, page = 0, size = 10, sort } = {}) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        params.set('page', page.toString());
        params.set('size', size.toString());
        if (sort) params.set('sort', sort);
        return `/units?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map((u) => ({ type: 'Units', id: u.id })),
              { type: 'Units', id: 'LIST' },
            ]
          : [{ type: 'Units', id: 'LIST' }],
    }),
    getUnitById: builder.query({
      query: (id) => `/units/${id}`,
      providesTags: (result, error, id) => [{ type: 'Units', id }],
    }),
    createUnit: builder.mutation({
      query: (payload) => ({
        url: '/units',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Units', id: 'LIST' }],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/units/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Units', id },
        { type: 'Units', id: 'LIST' },
      ],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({ url: `/units/${id}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Units', id },
        { type: 'Units', id: 'LIST' },
      ],
    }),
    getAllUnits: builder.query({
      query: () => '/units/all',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Units', id })), { type: 'Units', id: 'LIST' }]
          : [{ type: 'Units', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useGetAllUnitsQuery,
} = unitApi;
