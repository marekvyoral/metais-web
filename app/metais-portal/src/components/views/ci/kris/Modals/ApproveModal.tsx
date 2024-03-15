import { BaseModal, Button, GridCol, GridRow, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { useGenerateCodeAndURLHook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IApproveFormData, useGetKirtColumnsHook } from '@isdd/metais-common/api/userConfigKvKrit'
import { User } from '@isdd/metais-common/contexts/auth/authContext'
import { ModalButtons, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface IApproveModalProps {
    uuid: string
    open: boolean
    user?: User | null
    onClose: () => void
    onSave: (formData: IApproveFormData, close: (val: boolean) => void) => void
    onApproveKris: (formData: IApproveFormData, close: (val: boolean) => void) => void
}

export const ApproveModal: React.FC<IApproveModalProps> = ({ user, uuid, open, onClose, onSave, onApproveKris }) => {
    const { t } = useTranslation()

    const date = new Date().toISOString()
    const getKritColumnData = useGetKirtColumnsHook()
    const getGenerateCodeAndURL = useGenerateCodeAndURLHook()
    const [isError, setIsError] = useState<boolean>(false)
    const [isSave, setIsSave] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [storedData, setStoredData] = useState<IApproveFormData>({
        overil_datum: date,
        vyhotovil_datum: date,
        schvalil_datum: date,
        vyhotovil_funkcia: user?.position ?? '',
        vyhotovil_meno: `${user?.firstName} ${user?.lastName}`,
    })

    const { register, handleSubmit, reset, control, setValue } = useForm<IApproveFormData>({
        defaultValues: { overil_datum: date, vyhotovil_datum: date, schvalil_datum: date },
    })

    useEffect(() => {
        if (open) {
            setIsLoading(true)
            getKritColumnData(`KRIS/${uuid}/protocol?shared=true&_${Date.now()}`)
                .then((response: IApproveFormData) => {
                    setStoredData(response)
                    setIsLoading(false)
                })
                .catch(() => {
                    getGenerateCodeAndURL('KRIS_Protokol')
                        .then((protocol) => {
                            setStoredData({ ...storedData, Gen_Profil_kod_metais: protocol.cicode ?? '', Gen_Profil_ref_id: protocol.ciurl ?? '' })
                        })
                        .finally(() => {
                            setIsLoading(false)
                        })
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid, open])

    const close = (val: boolean) => {
        if (val) {
            reset()
            setIsSave(false)
            setStoredData({})
            onClose()
            return
        }
        setIsError(true)
    }

    return (
        <>
            <BaseModal isOpen={open} close={onClose}>
                <QueryFeedback loading={isLoading} withChildren>
                    {storedData.Gen_Profil_ref_id && (
                        <form
                            onSubmit={handleSubmit((formData) => {
                                isSave ? onSave(formData, close) : onApproveKris(formData, close)
                            })}
                            noValidate
                        >
                            <TextHeading size="L">{t('ciType.approve')}</TextHeading>
                            <MutationFeedback error={isError} onMessageClose={() => setIsError(false)} />
                            <GridRow>
                                <GridCol>
                                    <TextArea
                                        {...register('description')}
                                        label={t('modalKris.approveModal.description')}
                                        info={t('modalKris.approveModal.tooltip.description')}
                                        rows={3}
                                        defaultValue={storedData?.description}
                                    />
                                </GridCol>
                            </GridRow>
                            <GridRow>
                                <GridCol setWidth="one-half">
                                    <Input
                                        {...register('hodnotenie_spravnosti')}
                                        type="text"
                                        label={t('modalKris.approveModal.evalStructures')}
                                        info={t('modalKris.approveModal.tooltip.evalStructures')}
                                        defaultValue={storedData?.hodnotenie_spravnosti}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        {...register('hodnotenie_uplnosti')}
                                        type="text"
                                        label={t('modalKris.approveModal.evalData')}
                                        defaultValue={storedData?.hodnotenie_uplnosti}
                                    />
                                </GridCol>
                            </GridRow>
                            <GridRow>
                                <GridCol setWidth="one-third">
                                    <DateInput
                                        {...register('overil_datum')}
                                        label={t('modalKris.approveModal.verifiedDate')}
                                        control={control}
                                        setValue={setValue}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-third">
                                    <Input
                                        {...register('overil_funkcia')}
                                        label={t('modalKris.approveModal.verifiedOrg')}
                                        defaultValue={storedData?.overil_funkcia}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-third">
                                    <Input
                                        {...register('overil_meno')}
                                        label={t('modalKris.approveModal.verifiedName')}
                                        defaultValue={storedData?.overil_meno}
                                    />
                                </GridCol>
                            </GridRow>
                            <GridRow>
                                <GridCol setWidth="one-third">
                                    <DateInput
                                        {...register('schvalil_datum')}
                                        label={t('modalKris.approveModal.approveDate')}
                                        control={control}
                                        setValue={setValue}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-third">
                                    <Input
                                        {...register('schvalil_funkcia')}
                                        label={t('modalKris.approveModal.approveOrg')}
                                        defaultValue={storedData?.schvalil_funkcia}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-third">
                                    <Input
                                        {...register('schvalil_meno')}
                                        label={t('modalKris.approveModal.approveName')}
                                        defaultValue={storedData?.schvalil_meno}
                                    />
                                </GridCol>
                            </GridRow>
                            <GridRow>
                                <GridCol setWidth="one-third">
                                    <DateInput
                                        {...register('vyhotovil_datum')}
                                        label={t('modalKris.approveModal.evalDate')}
                                        control={control}
                                        setValue={setValue}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-third">
                                    <Input
                                        {...register('vyhotovil_funkcia')}
                                        label={t('modalKris.approveModal.evalOrg')}
                                        defaultValue={storedData?.vyhotovil_funkcia}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-third">
                                    <Input
                                        {...register('vyhotovil_meno')}
                                        label={t('modalKris.approveModal.evalName')}
                                        defaultValue={storedData?.vyhotovil_meno}
                                    />
                                </GridCol>
                            </GridRow>
                            <input type="hidden" {...register('Gen_Profil_kod_metais')} defaultValue={storedData?.Gen_Profil_kod_metais} />
                            <input type="hidden" {...register('Gen_Profil_ref_id')} defaultValue={storedData?.Gen_Profil_ref_id} />

                            <ModalButtons
                                submitButtonLabel={t('ciType.approve')}
                                additionalButtons={[
                                    <Button
                                        key={'saveApprovingItem'}
                                        variant="secondary"
                                        label={t('ciType.saveApprovingItem')}
                                        onClick={() => setIsSave(true)}
                                        type="submit"
                                    />,
                                ]}
                                closeButtonLabel={t('evaluation.cancelBtn')}
                                onClose={() => {
                                    reset()
                                    onClose()
                                }}
                            />
                        </form>
                    )}
                </QueryFeedback>
            </BaseModal>
        </>
    )
}
