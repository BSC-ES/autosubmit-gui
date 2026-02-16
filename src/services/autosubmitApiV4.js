import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

export const autosubmitApiV4 = createApi({
    reducerPath: 'autosubmitApiV4',
    baseQuery: fetchBaseQuery({
        baseUrl: AUTOSUBMIT_API_SOURCE + "/v4",
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
        getExperiments: builder.query({
            query: ({
                page = 1,
                page_size = 12,
                query,
                only_active,
                exp_type,
                autosubmit_version,
                owner,
                hpc,
                order_by,
                order_desc
            }) => {
                return ({
                    url: `experiments`,
                    params: {
                        page,
                        page_size,
                        query,
                        only_active,
                        exp_type,
                        autosubmit_version,
                        owner,
                        hpc,
                        order_by,
                        order_desc
                    }
                })
            }
        }),
        getExperimentJobs: builder.query({
            query: ({ expid, query = undefined, status = undefined, page = undefined, page_size = undefined }) => {
                return {
                    url: `experiments/${expid}/jobs`,
                    method: "GET",
                    params: {
                        query,
                        status,
                        page,
                        page_size
                    }
                }
            }
        }),
        getExperimentRuns: builder.query({
            query: ({ expid }) => {
                return {
                    url: `experiments/${expid}/runs`,
                    method: "GET"
                }
            }
        }),
        getExperimentConfigurationMixed: builder.query({
            query: ({ expid, run_id }) => {
                // Gets the configuration of the experiment from the file system or a specific run
                if (run_id === "fs") {
                    return {
                        url: `experiments/${expid}/filesystem-config`,
                        method: "GET"
                    }
                } else {
                    return {
                        url: `experiments/${expid}/runs/${run_id}/config`,
                        method: "GET"
                    }
                }
            }
        }),
        getUserMetricsRuns: builder.query({
            query: ({ expid }) => {
                return {
                    url: `experiments/${expid}/user-metrics-runs`,
                    method: "GET"
                }
            }
        }),
        getUserMetricsByRun: builder.query({
            query: ({ expid, run_id }) => {
                return {
                    url: `experiments/${expid}/runs/${run_id}/user-metrics`,
                    method: "GET"
                }
            }
        }),
        login: builder.mutation({
            query: ({ provider, ticket, service, code, redirect_uri }) => {
                if (provider === "oidc") {
                    return {
                        url: `auth/oidc/login`,
                        method: "GET",
                        params: {
                            code: code,
                            redirect_uri: redirect_uri
                        }
                    }
                } else if (provider === "github") {
                    return {
                        url: `auth/oauth2/github/login`,
                        method: "GET",
                        params: {
                            code: code
                        }
                    }
                } else {
                    return {
                        url: `auth/cas/v2/login`,
                        method: "GET",
                        params: {
                            ticket: ticket,
                            service: service
                        }
                    }
                }
            }
        }),
        verifyToken: builder.query({
            query: () => {
                return {
                    url: `auth/verify-token`,
                    method: "GET"
                }
            },
            keepUnusedDataFor: 1
        }),
        getPreferredUsername: builder.query({
            query: () => {
                return {
                    url: `user-settings/preferred-username`,
                    method: "GET"
                }
            },
        }),
        updatePreferredUsername: builder.mutation({
            query: ({ preferred_username }) => {
                return {
                    url: `user-settings/preferred-username`,
                    method: "POST",
                    body: {
                        preferred_username: preferred_username
                    }
                }
            },
        }),
        getRunnersConfigProfiles: builder.query({
            query: () => {
                return {
                    url: `/runners/configuration/profiles`,
                    method: "GET"
                }
            }
        }),
        getPublicSSHKeys: builder.query({
            query: () => {
                return {
                    url: `/runners/configuration/ssh-public-keys`,
                    method: "GET"
                }
            }
        }),
        runJobSetStatusCommand: builder.mutation({
            query: (body) => ({
                url: `/runners/command/set-job-status`,
                method: "POST",
                body
            })
        }),
        runnerRunExperiment: builder.mutation({
            query: (body) => ({
                url: `/runners/command/run-experiment`,
                method: "POST",
                body
            })
        }),
        runnerStopExperiment: builder.mutation({
            query: (body) => ({
                url: `/runners/command/stop-experiment`,
                method: "POST",
                body
            })
        }),
        runnerRunStatusCheck: builder.query({
            query: ({ expid }) => ({
                url: `/runners/command/get-runner-run-status`,
                method: "POST",
                body: {
                    expid: expid
                }
            })
        }),
    }),
})

export const {
    useGetExperimentsQuery
} = autosubmitApiV4