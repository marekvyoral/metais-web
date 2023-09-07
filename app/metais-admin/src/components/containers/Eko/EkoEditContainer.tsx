import { QueryFeedback } from '@isdd/metais-common'
import { EkoCode, GetEkoCodesParams, useEditEkoCode, useGetEkoCodes } from '@isdd/metais-common/api'
import React from 'react'

import { IEkoEditView } from '@/components/views/eko/ekoCodes'
import { enrichEkoDataMaper } from '@/components/views/eko/ekoHelpers'

export interface IEditEkoCodeContainerProps {
    ekoCode: string
    View: React.FC<IEkoEditView>
}

export const EkoEditContainer: React.FC<IEditEkoCodeContainerProps> = ({ ekoCode, View }) => {
    const defaultParams: GetEkoCodesParams = { sortBy: 'ekoCode', ascending: true }
    const { data, isLoading, isError } = useGetEkoCodes(defaultParams)
    const editData = enrichEkoDataMaper(data?.ekoCodes || []).find((item) => item.ekoCode === ekoCode)

    const { mutateAsync } = useEditEkoCode()

    const editEko = async (editedEkoCode: EkoCode) => {
        await mutateAsync({
            ekoCodeId: editedEkoCode.ekoCode || '',
            data: {
                ...editedEkoCode,
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={editData} mutate={editEko} />
        </QueryFeedback>
    )
}