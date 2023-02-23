import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dataApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://165.22.49.123:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const {
        login: { token },
      } = getState();
      headers.set('Authorization', token ? `Token ${token}` : '');
      return headers;
    },
  }),
  tagTypes: ['Students', 'Payments'],
  reducerPath: 'dataApi',
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => 'users/users/',
    }),

    getUserById: build.query({
      query: (body) => `users/users/${body.recruiterId}`,
    }),

    getCourses: build.query({
      query: () => '/v1/mainapp/course/',
    }),

    getCourseById: build.query({
      query: (body) => `/v1/mainapp/course/${body.courseId}`,
    }),

    getBranches: build.query({
      query: () => '/v1/branches/branches/',
    }),

    getCountries: build.query({
      query: () => '/v1/branches/countries/',
    }),

    getStudents: build.query({
      query: () => 'v1/students/students',
      providesTags: ['Students'],
    }),

    getStudentById: build.query({
      query: (studentId) => `/v1/students/students/${studentId}`,
      providesTags: ['Students'],
    }),

    addStudent: build.mutation({
      query: (body) => ({
        method: 'POST',
        url: '/v1/students/students/',
        body,
      }),
      invalidatesTags: ['Students'],
    }),

    editStudent: build.mutation({
      query: (body) => ({
        method: 'PUT',
        url: `/v1/students/students/${body.studentId}`,
        body: body.reqBody,
      }),
      invalidatesTags: ['Students'],
    }),

    deleteStudent: build.mutation({
      query: (studentId) => ({
        method: 'DELETE',
        url: `/v1/students/students/${studentId}`,
      }),
      invalidatesTags: ['Students'],
    }),

    getStudentsPayments: build.query({
      query: () => 'v1/students/payment_students/',
      providesTags: ['Payments'],
    }),

    getPaymentsByStudentId: build.query({
      query: (studentId) => `v1/students/payment_students/${studentId}`,
    }),

    addPayment: build.mutation({
      query: (reqBody) => ({
        method: 'POST',
        url: '/v1/students/payment_students/',
        body: reqBody,
      }),
      invalidatesTags: ['Payments'],
    }),

    getMentors: build.query({
      query: () => '/v1/mainapp/mentor/',
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetBranchesQuery,
  useGetCountriesQuery,
  useGetMentorsQuery,
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useEditStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsPaymentsQuery,
  useGetPaymentsByStudentIdQuery,
  useAddPaymentMutation,
} = dataApi;
