import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

export const autosubmitApiV3 = createApi({
    reducerPath: 'autosubmitApiV3',
    baseQuery: fetchBaseQuery({ baseUrl: AUTOSUBMIT_API_SOURCE + "/v3" }),
    keepUnusedDataFor: 5,
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
            query: ({ expid, signal, runId }) => {
                if (runId) {
                    return {
                        url: `rundetail/${expid}/${runId}`,
                        signal: signal
                    }
                }
                return {
                    url: `tree/${expid}`,
                    signal: signal
                }
            }
        }),
        getExperimentGraphView: builder.query({
            query: ({ expid, layout, grouped, signal }) => ({
                url: `graph/${expid}/${layout}/${grouped}`,
                signal: signal
            })
        }),
        getExperimentRunLog: builder.query({
            query: (expid) => `exprun/${expid}`
        }),
        getExperimentConfiguration: builder.query({
            query: (expid) => `cconfig/${expid}`
        }),
        getExperimentStats: builder.query({
            query: ({ expid, hours, section }) => `stats/${expid}/${hours}/${section}`
        }),
        getExperimentPerformance: builder.query({
            query: (expid) => `performance/${expid}`
        }),
        getJobLog: builder.query({
            query: (logFile) => `joblog/${logFile}`
        }),
        getRuns: builder.query({
            query: (expid) => `runs/${expid}`
        }),
        showdownRoute: builder.query({
            keepUnusedDataFor: 1, // reduce cache time
            query: ({
                route,
                loggedUser,
                expid = null
            }) => {
                return ({
                    url: `shutdown/${route}`,
                    params: {
                        loggedUser: loggedUser,
                        expid: expid
                    }
                })
            }
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
    useGetExperimentPerformanceQuery,
    useGetJobLogQuery,
    useGetRunsQuery
} = autosubmitApiV3