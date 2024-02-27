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
                        order_by,
                        order_desc
                    }
                })
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
        verifyToken: builder.mutation({
            query: () => {
                return {
                    url: `auth/verify-token`,
                    method: "GET"
                }
            }
        }),
    }),
})

export const {
    useGetExperimentsQuery
} = autosubmitApiV4