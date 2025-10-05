import { clearToken, setToken, setUser } from '@store/slices/authSlice';
import { rootApi } from './rootApi';

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number, unit_id }) => ({
        url: '/auth/register',

        body: {
          name,
          email,
          password,
          confirm_password,
          phone_number,
          unit_id,
        },
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        body: { email, password },
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data));
          dispatch(
            authApi.util.getAuthUser.initiate(undefined, {
              forceRefetch: true,
            }),
          );
        } catch {
          //
        }
      },
      invalidatesTags: ['Auth'],
    }),
    getAuthUser: builder.query({
      query: () => '/auth/auth-user',
      providesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          //
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearToken());
          dispatch(rootApi.util.resetApiState());
        }
      },
      invalidatesTags: ['Auth'],
    }),
    enableUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/enable`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    disableUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/disable`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Users', id })), { type: 'Users', id: 'LIST' }]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword, confirmPassword }) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmPassword,
        },
      }),
    }),
    getAllRoles: builder.query({
      query: () => ({
        url: '/users/roles',
        method: 'GET',
      }),
      providesTags: ['Roles'],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, roleId }) => ({
        url: `/users/${userId}/roles`,
        method: 'PUT',
        body: { role_id: roleId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Users', id: 'LIST' },
        { type: 'Users', id: userId },
      ],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id: 'LIST' },
        { type: 'Users', id },
      ],
    }),
    updateUserUnitByAdmin: builder.mutation({
      query: ({ id, unitId }) => ({
        url: `/users/admin/${id}/unit`,
        method: 'PUT',
        body: { unit_id: unitId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id: 'LIST' },
        { type: 'Users', id },
      ],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, new_password: newPassword },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthUserQuery,
  useLogoutMutation,
  useGetAllUsersQuery,
  useEnableUserMutation,
  useDisableUserMutation,
  useChangePasswordMutation,
  useGetAllRolesQuery,
  useUpdateUserRoleMutation,
  useUpdateUserMutation,
  useUpdateUserUnitByAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
