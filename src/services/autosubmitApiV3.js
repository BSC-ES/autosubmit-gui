import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../components/context/vars'

export const autosubmitApiV3 = createApi({
    reducerPath: 'autosubmitApiV3',
    baseQuery: fetchBaseQuery({ baseUrl: AUTOSUBMIT_API_SOURCE + "/v3" }),
    endpoints: (builder) => ({
        getRunningExperiments: builder.query({
            query: () => `running`
        }),
        getExperimentTreeView: builder.query({
            query: (expid) => `tree/${expid}`
        })
    }),
})

export const {
    useGetRunningExperimentsQuery,
    useGetExperimentTreeViewQuery
} = autosubmitApiV3