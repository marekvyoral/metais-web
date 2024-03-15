import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'

import { CodeListsMutations } from '@/components/containers/Codelist/CodelistContainer'

interface ICodelistSucces {
    mutations: CodeListsMutations
    isFetchError: boolean
}

export const CodelistsFeedback: React.FC<ICodelistSucces> = ({ mutations, isFetchError }) => {
    const { updateEnum, createEnum, validateEnum, deleteEnum } = mutations

    const isError = updateEnum.isError || validateEnum.isError || deleteEnum.isError
    const isSuccess = updateEnum.isSuccess || createEnum.isSuccess || validateEnum.isSuccess || deleteEnum.isSuccess

    return (
        <>
            <MutationFeedback success={isSuccess} error={isError} />
            <QueryFeedback loading={false} error={isFetchError} withChildren />
        </>
    )
}
