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
            query: ({ expid }) => {
                return {
                    url: `experiments/${expid}/jobs`,
                    method: "GET"
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
        login: builder.mutation({
            query: ({ provider, ticket, service, code }) => {
                if (provider === "github") {
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
    }),
})

export const {
    useGetExperimentsQuery
} = autosubmitApiV4