import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

export const autosubmitApiV4 = createApi({
    reducerPath: 'autosubmitApiV4',
    baseQuery: fetchBaseQuery({ baseUrl: AUTOSUBMIT_API_SOURCE + "/v4" }),
    endpoints: (builder) => ({
        getExperiments: builder.query({
            query: () => `experiments`
        }),
    }),
})

export const { 
    useGetExperimentsQuery
} = autosubmitApiV4