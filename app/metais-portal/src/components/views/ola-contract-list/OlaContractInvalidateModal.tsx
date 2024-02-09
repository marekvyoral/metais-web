import { BaseModal, Button, TextArea, TextHeading, TextWarning } from '@isdd/idsk-ui-kit/index'
import { AttributeUi, useInvalidateConfigurationItem, useReadConfigurationItemsByMetaIsCodes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiOlaContractData } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface IOlaContractInvalidateModal {
    olaContract?: ApiOlaContractData
    open: boolean
    close: () => void
    onInvalidated: () => void
}

export const OlaContractInvalidateModal: React.FC<IOlaContractInvalidateModal> = ({ olaContract, open, close, onInvalidated }) => {
    const { t } = useTranslation()
    const { mutateAsync: invalidateItem, isLoading: isInvalidating, isError: isInvalidationError } = useInvalidateConfigurationItem()
    const { mutateAsync: readAsCi, isLoading: isCiCodeLoading, isError: isCiCodeError } = useReadConfigurationItemsByMetaIsCodes()
    const { register, handleSubmit, reset } = useForm()
    const { getRequestStatus, isLoading, isProcessedError } = useGetStatus('PROCESSED')
    const name = olaContract?.name
    const onSubmit = async (formData: FieldValues) => {
        const ci = await readAsCi({ data: { metaIsCodes: [olaContract?.code ?? ''] } })
        const requestId = await invalidateItem({
            data: {
                ...ci.configurationItemSet?.at(0),
                attributes: ci.configurationItemSet?.at(0)?.attributes as AttributeUi[],
                invalidateReason: { comment: formData['note'] ?? '' },
            },
        })
        getRequestStatus(requestId.requestId ?? '', () => onInvalidated())
    }

    useEffect(() => {
        reset()
    }, [open, reset])

    return (
        <BaseModal isOpen={open} close={close}>
            <QueryFeedback
                loading={isInvalidating || isLoading || isCiCodeLoading}
                error={isInvalidationError || isProcessedError || isCiCodeError}
                withChildren
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextHeading size="L">{t('olaContracts.invalidateModal.heading', { name })}</TextHeading>
                    <TextWarning>{t('olaContracts.invalidateModal.warning')}</TextWarning>
                    <TextArea rows={3} {...register('note')} label={t('olaContracts.invalidateModal.note')} />
                    <SubmitWithFeedback
                        submitButtonLabel={t('olaContracts.invalidateModal.invalidation')}
                        loading={isInvalidating || isLoading}
                        additionalButtons={[<Button key={1} variant="secondary" label={t('olaContracts.invalidateModal.cancel')} onClick={close} />]}
                    />
                </form>
            </QueryFeedback>
        </BaseModal>
    )
}
