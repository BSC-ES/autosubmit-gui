import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../components/context/vars'

export const autosubmitApiV3 = createApi({
    reducerPath: 'autosubmitApiV3',
    baseQuery: fetchBaseQuery({ baseUrl: AUTOSUBMIT_API_SOURCE + "/v3" }),
    endpoints: (builder) => ({
        getRunningExperiments: builder.query({
            query: () => `running`
        }),
        getExperimentInfo: builder.query({
            query: (expid) => `expinfo/${expid}`
        }),
        getExperimentTreeView: builder.query({
            query: (expid) => `tree/${expid}`
        }),
        getExperimentGraphView: builder.query({
            query: ({expid, layout, grouped}) => `graph/${expid}/${layout}/${grouped}`
        }),
        getExperimentRunLog: builder.query({
            query: (expid) => `exprun/${expid}`
        }),
        getExperimentConfiguration: builder.query({
            query: (expid) => `cconfig/${expid}`
        }),
    }),
})

export const {
    useGetRunningExperimentsQuery,
    useGetExperimentInfoQuery,
    useGetExperimentTreeViewQuery,
    useGetExperimentGraphViewQuery,
    useGetExperimentRunLogQuery,
    useGetExperimentConfigurationQuery,
} = autosubmitApiV3