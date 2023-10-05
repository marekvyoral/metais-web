import { EkoCode, GetEkoCodesParams, useEditEkoCode, useGetEkoCodes } from '@isdd/metais-common/api'
import React from 'react'
import { ADMIN_EKO_LIST_QKEY } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'

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

    const queryClient = useQueryClient()
    const { mutateAsync } = useEditEkoCode({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EKO_LIST_QKEY])
            },
        },
    })

    const editEko = async (editedEkoCode: EkoCode) => {
        await mutateAsync({
            ekoCodeId: editedEkoCode.ekoCode || '',
            data: {
                ...editedEkoCode,
            },
        })
    }

    return <View data={editData} mutate={editEko} isLoading={isLoading} isError={isError} />
}
