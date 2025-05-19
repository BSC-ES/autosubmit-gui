import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

export const autosubmitApiV3 = createApi({
    reducerPath: 'autosubmitApiV3',
    baseQuery: fetchBaseQuery({
        baseUrl: AUTOSUBMIT_API_SOURCE + "/v3",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set('Authorization', token)
            }
            return headers
        },
    }),
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
                const args = {
                    url: runId ? `rundetail/${expid}/${runId}` : `tree/${expid}`
                }
                if (signal) args.signal = signal
                return args
            }
        }),
        getExperimentGraphView: builder.query({
            query: ({ expid, layout, grouped, signal }) => {
                const args = {
                    url: `graph/${expid}/${layout}/${grouped}`
                }
                if (signal) args.signal = signal
                return args
            }
        }),
        getExperimentRunLog: builder.query({
            query: (expid) => `exprun/${expid}`
        }),
        getExperimentRecoveryLog: builder.query({
            query: (expid) => `exp-recovery-logs/${expid}`
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
        getJobHistory: builder.query({
            query: ({expid, jobName}) => `history/${expid}/${jobName}`
        }),
        getPklInfo: builder.query({
            query: ({ expid, timestamp = 0 }) => {
                return {
                    url: `pklinfo/${expid}/${timestamp}`
                }
            }
        }),
        getPklTreeInfo: builder.query({
            query: ({ expid, timestamp = 0 }) => {
                return {
                    url: `pkltreeinfo/${expid}/${timestamp}`
                }
            }
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