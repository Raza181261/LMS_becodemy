import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponses = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

// export const authApi = apiSlice.injectEndpoints({
//     endpoints:(builder) => ({
//         //endpoint here
//         register: builder.mutation<RegistrationResponses,RegistrationData>({
//             query:(data)=> ({
//                 url:"registration",
//                 method:"POST",
//                 body:data,
//                 credentials:"Include" as const
//             }),
//             async onQueryStarted(arg,{queryFulfilled,dispatch}){
//                 try {
//                     const result = await queryFulfilled;
//                     dispatch(userRegistration({
//                         token: result.data.activationToken
//                     }))
//                 } catch (error) {
//                     console.log(error)
//                 }
//             }
//         })
//     })
// })

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Endpoint here
    register: builder.mutation<RegistrationResponses, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST", // Ensure method is uppercase for consistency
        body: data,
        credentials: "include", // Fixed here
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activation-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: {
          email,
          name,
          avatar,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logOut: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogOutQuery,
} = authApi;
