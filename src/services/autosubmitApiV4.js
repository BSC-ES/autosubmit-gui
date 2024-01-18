import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

export const autosubmitApiV4 = createApi({
    reducerPath: 'autosubmitApiV4',
    baseQuery: fetchBaseQuery({ baseUrl: AUTOSUBMIT_API_SOURCE + "/v4" }),
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
    }),
})

export const {
    useGetExperimentsQuery
} = autosubmitApiV4