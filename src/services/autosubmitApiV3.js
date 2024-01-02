import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

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
        getExperimentQuickView: builder.query({
            query: (expid) => `quick/${expid}`
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
        getExperimentStats: builder.query({
            query: ({expid, hours, section}) => `stats/${expid}/${hours}/${section}`
        }),
    }),
})

export const {
    useGetRunningExperimentsQuery,
    useGetExperimentInfoQuery,
    useGetExperimentQuickViewQuery,
    useGetExperimentTreeViewQuery,
    useGetExperimentGraphViewQuery,
    useGetExperimentRunLogQuery,
    useGetExperimentConfigurationQuery,
    useGetExperimentStatsQuery,
} = autosubmitApiV3