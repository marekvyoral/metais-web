import { EkoCode, GetEkoCodesParams, useCreateEkoCode, useGetEkoCodes } from '@isdd/metais-common/api'
import React from 'react'

import { IEkoCreateView } from '@/components/views/eko/ekoCodes'
import { enrichEkoDataMaper } from '@/components/views/eko/ekoHelpers'

export interface ICreateEkoCodeContainerProps {
    View: React.FC<IEkoCreateView>
}

export const EkoCreateContainer: React.FC<ICreateEkoCodeContainerProps> = ({ View }) => {
    const defaultParams: GetEkoCodesParams = { sortBy: 'ekoCode', ascending: true }
    const { data, isLoading, isError } = useGetEkoCodes(defaultParams)
    const ekoCodes = enrichEkoDataMaper(data?.ekoCodes || [])

    const { mutateAsync } = useCreateEkoCode()

    const createEko = async (ekoCode: EkoCode) => {
        await mutateAsync({
            data: {
                ...ekoCode,
            },
        })
    }

    return <View data={ekoCodes} mutate={createEko} isLoading={isLoading} isError={isError} />
}
