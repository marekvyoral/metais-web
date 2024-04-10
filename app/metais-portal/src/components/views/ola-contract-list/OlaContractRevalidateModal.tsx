import { BaseModal, Button, CheckBox, TextHeading, TextWarning } from '@isdd/idsk-ui-kit/index'
import {
    CiWithRelsResultUi,
    useReadCiNeighboursWithAllRels,
    useRecycleInvalidatedCis,
    useRecycleInvalidatedRels,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiOlaContractData } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface IOlaContractRevalidateModal {
    olaContract?: ApiOlaContractData
    open: boolean
    close: () => void
    onRevalidated: () => void
}

export const OlaContractRevalidateModal: React.FC<IOlaContractRevalidateModal> = ({ olaContract, open, close, onRevalidated }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm()
    const { getRequestStatus, isLoading, isProcessedError } = useGetStatus('PROCESSED')

    const { data: readRels } = useReadCiNeighboursWithAllRels(olaContract?.uuid ?? '', {
        ciTypes: ['ISVS'],
        state: ['DRAFT', 'INVALIDATED', 'DELETED'],
        perPage: 10000,
    })
    const { mutateAsync: recycle, isLoading: isRecycleLoading, isError: isRecycleError } = useRecycleInvalidatedCis()
    const { mutateAsync: recycleRels, isLoading: isRecycleRelsLoading, isError: isRecycleRelsError } = useRecycleInvalidatedRels()

    const name = olaContract?.name

    const getRelsUuid = (relations?: CiWithRelsResultUi) => {
        const uuids: string[] = []
        relations?.ciWithRels?.forEach((r) => {
            r.rels?.forEach((rel) => uuids.push(rel.uuid ?? ''))
        })
        return uuids
    }

    const onCiRevalidated = async () => {
        const requestId = await recycleRels({ data: { relIdList: getRelsUuid(readRels) } })
        getRequestStatus(requestId.requestId ?? '', () => onRevalidated())
    }

    const onSubmit = async (formData: FieldValues) => {
        const requestId = await recycle({ data: { ciIdList: [olaContract?.uuid ?? ''] } })
        getRequestStatus(requestId.requestId ?? '', () => (formData['revalidateRels'] ? onCiRevalidated() : onRevalidated()))
    }

    useEffect(() => {
        reset()
    }, [open, reset])

    return (
        <BaseModal isOpen={open} close={close}>
            <QueryFeedback
                loading={isLoading || isRecycleLoading || isRecycleRelsLoading}
                error={isProcessedError || isRecycleError || isRecycleRelsError}
                withChildren
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextHeading size="L">{t('olaContracts.revalidateModal.heading', { name })}</TextHeading>
                    <TextWarning>{t('olaContracts.revalidateModal.warning')}</TextWarning>
                    <CheckBox {...register('revalidateRels')} id="revalidateRels" label={t('olaContracts.revalidateModal.revalidateRels')} />
                    <Spacer vertical />
                    <SubmitWithFeedback
                        submitButtonLabel={t('olaContracts.revalidateModal.validation')}
                        loading={isLoading}
                        additionalButtons={[<Button key={1} variant="secondary" label={t('olaContracts.revalidateModal.cancel')} onClick={close} />]}
                    />
                </form>
            </QueryFeedback>
        </BaseModal>
    )
}
