import { MutationFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CodeListDetailMutations } from '@/components/containers/Codelist/CodelistDetailContainer'

interface ICodelistSucces {
    mutations: CodeListDetailMutations
}

export const CodelistDetailFeedback: React.FC<ICodelistSucces> = ({ mutations }) => {
    const { t } = useTranslation()
    const { updateEnumItem, validateEnumItem, createEnumItem, deleteEnumItem } = mutations

    const isError = updateEnumItem.isError || validateEnumItem.isError || deleteEnumItem.isError
    const isSuccess = updateEnumItem.isSuccess || createEnumItem.isSuccess || validateEnumItem.isSuccess || deleteEnumItem.isSuccess
    const successMessage = () => {
        if (updateEnumItem.isLoading || createEnumItem.isLoading || validateEnumItem.isLoading || deleteEnumItem.isLoading) return ''
        if (updateEnumItem.isSuccess) return t('mutationFeedback.successfulUpdated')
        if (createEnumItem.isSuccess) return t('mutationFeedback.successfulCreated')
        if (validateEnumItem.isSuccess) return t('mutationFeedback.successfulUpdated')
        if (deleteEnumItem.isSuccess) return t('mutationFeedback.successfulUpdated')
        return ''
    }

    return <MutationFeedback success={isSuccess} error={isError} successMessage={successMessage()} />
}
