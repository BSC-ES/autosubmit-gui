import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTOSUBMIT_API_SOURCE } from '../consts'

export const autosubmitApiDefault = createApi({
    reducerPath: "autosubmitApiDefault",
    baseQuery: fetchBaseQuery({
        baseUrl: AUTOSUBMIT_API_SOURCE,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set("Authorization", token)
            }
            return headers
        },
    }),
    keepUnusedDataFor: 5,
    endpoints: (builder) => ({
        getApiDetails: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            })
        }),
    }),
})
