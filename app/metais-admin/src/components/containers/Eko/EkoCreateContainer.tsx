import { EkoCode, GetEkoCodesParams, useCreateEkoCode, useGetEkoCodes } from '@isdd/metais-common/api/generated/tco-swagger'
import React from 'react'
import { ADMIN_EKO_LIST_QKEY } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'

import { IEkoCreateView } from '@/components/views/eko/ekoCodes'
import { enrichEkoDataMaper } from '@/components/views/eko/ekoHelpers'

export interface ICreateEkoCodeContainerProps {
    View: React.FC<IEkoCreateView>
}

export const EkoCreateContainer: React.FC<ICreateEkoCodeContainerProps> = ({ View }) => {
    const defaultParams: GetEkoCodesParams = { sortBy: 'ekoCode', ascending: true }
    const { data, isLoading, isError } = useGetEkoCodes(defaultParams)
    const ekoCodes = enrichEkoDataMaper(data?.ekoCodes || [])

    const queryClient = useQueryClient()
    const { mutateAsync } = useCreateEkoCode({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EKO_LIST_QKEY])
            },
        },
    })

    const createEko = async (ekoCode: EkoCode) => {
        await mutateAsync({
            data: {
                ...ekoCode,
            },
        })
    }

    return <View data={ekoCodes} mutate={createEko} isLoading={isLoading} isError={isError} />
}
