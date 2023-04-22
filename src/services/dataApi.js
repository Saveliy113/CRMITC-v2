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
  tagTypes: [
    'Courses',
    'Students',
    'Payments',
    'StudentPayments',
    'Clients',
    'TrailLessons',
  ],
  reducerPath: 'dataApi',
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => 'users/users/',
    }),

    getUserById: build.query({
      query: (body) => `users/users/${body.recruiterId}`,
    }),

    getBranches: build.query({
      query: () => '/v1/branches/branches/',
    }),

    getBranchById: build.query({
      query: (brancheId) => `/v1/branches/branches/${brancheId}`,
    }),

    getCourses: build.query({
      query: () => '/v1/mainapp/course/',
      providesTags: ['Courses'],
    }),

    getCourseById: build.query({
      query: (courseId) => `/v1/mainapp/course/${courseId}`,
      providesTags: ['Courses'],
    }),

    addCourse: build.mutation({
      query: (body) => ({
        method: 'POST',
        url: '/v1/mainapp/course/',
        body,
      }),
      invalidatesTags: ['Courses'],
    }),
    editCourse: build.mutation({
      query: (body) => ({
        method: 'PUT',
        url: `/v1/mainapp/course/${body.courseId}/`,
        body: body.courseReqBody,
      }),
      invalidatesTags: ['Courses'],
    }),

    deleteCourse: build.mutation({
      query: (courseId) => ({
        method: 'DELETE',
        url: `/v1/mainapp/course/${courseId}`,
      }),
      invalidatesTags: ['Courses'],
    }),

    getMentors: build.query({
      query: () => '/v1/mainapp/mentor/',
    }),

    getCountries: build.query({
      query: () => '/v1/branches/countries/',
    }),

    getDirections: build.query({
      query: () => '/v1/branches/direction/',
    }),

    getDirectionById: build.query({
      query: (directionId) => `/v1/branches/direction/${directionId}`,
    }),

    getStudents: build.query({
      query: () => 'v1/students/students/',
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
      invalidatesTags: ['Students', 'Courses'],
    }),

    editStudent: build.mutation({
      query: (body) => ({
        method: 'PUT',
        url: `/v1/students/students/${body.studentId}/`,
        body: body.studentReqBody,
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
      query: (studentId) =>
        `v1/students/payment_students/?student=${studentId}`,
      providesTags: ['StudentPayments'],
    }),

    getPaymentById: build.query({
      query: (paymentId) => `/v1/students/payment_students/${paymentId}/`,
      providesTags: ['StudentPayments'],
    }),

    addPayment: build.mutation({
      query: (reqBody) => ({
        method: 'POST',
        url: '/v1/students/payment_students/',
        body: reqBody,
      }),
      invalidatesTags: ['StudentPayments', 'Students'],
    }),

    editPayment: build.mutation({
      query: (body) => ({
        method: 'PATCH',
        url: `/v1/students/payment_students/${body.paymentId}/`,
        body: body.paymentReqBody,
      }),
      invalidatesTags: ['StudentPayments'],
    }),

    deletePayment: build.mutation({
      query: (paymentId) => ({
        method: 'DELETE',
        url: `/v1/students/payment_students/${paymentId}/`,
      }),
      invalidatesTags: ['StudentPayments'],
    }),

    getTrailLessons: build.query({
      query: () => '/v2/sales/trail_lessons/',
      providesTags: ['TrailLessons'],
    }),

    getTrailLessonById: build.query({
      query: (lessonId) => `/v2/sales/trail_lessons/${lessonId}`,
      providesTags: ['TrailLessons'],
    }),

    addTrailLesson: build.mutation({
      query: (body) => ({
        method: 'POST',
        url: '/v2/sales/trail_lessons/',
        body,
      }),
      invalidatesTags: ['TrailLessons'],
    }),

    editTrailLesson: build.mutation({
      query: (body) => ({
        method: 'PUT',
        url: `/v2/sales/trail_lessons/${body.lessonId}`,
        body: body.reqBody,
      }),
      invalidatesTags: ['TrailLessons'],
    }),

    deleteTrailLesson: build.mutation({
      query: (lessonId) => ({
        method: 'DELETE',
        url: `/v2/sales/trail_lessons/${lessonId}`,
      }),
      invalidatesTags: ['TrailLessons'],
    }),

    getClients: build.query({
      query: () => '/v2/sales/clients/',
      providesTags: ['Clients'],
    }),

    getClientById: build.query({
      query: (clientId) => `/v2/sales/clients/${clientId}/`,
      providesTags: ['Clients'],
    }),

    getClientStatus: build.query({
      query: () => '/v2/sales/client_status/',
    }),

    addClient: build.mutation({
      query: (body) => ({
        method: 'POST',
        url: `/v2/sales/clients/`,
        body: body,
      }),
      invalidatesTags: ['TrailLessons', 'Clients'],
    }),

    editClient: build.mutation({
      query: (body) => ({
        method: 'PUT',
        url: `/v2/sales/clients/${body.clientId}/`,
        body: body.reqBody,
      }),
      invalidatesTags: ['Clients'],
    }),

    deleteClient: build.mutation({
      query: (clientId) => ({
        method: 'DELETE',
        url: `/v2/sales/clients/${clientId}/`,
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useGetDirectionsQuery,
  useGetDirectionByIdQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useAddCourseMutation,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useGetMentorsQuery,
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useEditStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsPaymentsQuery,
  useGetPaymentsByStudentIdQuery,
  useGetPaymentByIdQuery,
  useEditPaymentMutation,
  useDeletePaymentMutation,
  useAddPaymentMutation,
  useGetTrailLessonsQuery,
  useGetTrailLessonByIdQuery,
  useEditTrailLessonMutation,
  useDeleteTrailLessonMutation,
  useAddTrailLessonMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetClientStatusQuery,
  useAddClientMutation,
  useEditClientMutation,
  useDeleteClientMutation,
} = dataApi;
