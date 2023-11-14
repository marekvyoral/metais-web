import { GetEkoCodesParams, useGetEkoCodes } from '@isdd/metais-common/api/generated/tco-swagger'
import React from 'react'

import { IEkoDetailView } from '@/components/views/eko/ekoCodes'
import { enrichEkoDataMaper } from '@/components/views/eko/ekoHelpers'

export interface IEkoDetailContainerProps {
    ekoCode: string
    View: React.FC<IEkoDetailView>
}

export const EkoDetailContainer: React.FC<IEkoDetailContainerProps> = ({ ekoCode, View }) => {
    const defaultParams: GetEkoCodesParams = { sortBy: 'ekoCode', ascending: true }
    const { data, isLoading, isError } = useGetEkoCodes(defaultParams)
    const detailData = enrichEkoDataMaper(data?.ekoCodes || []).find((item) => item.ekoCode === ekoCode)

    return <View data={detailData} isLoading={isLoading} isError={isError} />
}
