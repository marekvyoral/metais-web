import React from 'react'
import { useTranslation } from 'react-i18next'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'

import { CodeListsMutations } from '../containers/Codelist/CodelistContainer'

interface ICodelistSucces {
    mutations: CodeListsMutations
    isFetchError: boolean
}

export const CodelistsFeedback: React.FC<ICodelistSucces> = ({ mutations, isFetchError }) => {
    const { t } = useTranslation()
    const { updateEnum, createEnum, validateEnum, deleteEnum } = mutations

    const isError = updateEnum.isError || createEnum.isError || validateEnum.isError || deleteEnum.isError
    const isSuccess = updateEnum.isSuccess || createEnum.isSuccess || validateEnum.isSuccess || deleteEnum.isSuccess

    return (
        <>
            <MutationFeedback success={isSuccess} error={isError ? t('feedback.mutationErrorMessage') : undefined} />
            <QueryFeedback loading={false} error={isFetchError} withChildren />
        </>
    )
}
