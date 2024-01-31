import { BaseModal, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { useGenerateCodeAndURLHook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ModalButtons, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface IReturnToWorkoutFormData {
    Gen_Profil_kod_metais?: string
    Gen_Profil_ref_id?: string
    note?: string
}
export interface IReturnToWorkoutModalProps {
    open: boolean
    onClose: () => void
    onSend: (formData: IReturnToWorkoutFormData) => void
}

export const ReturnToWorkoutModal: React.FC<IReturnToWorkoutModalProps> = ({ open, onClose, onSend }) => {
    const { t } = useTranslation()
    const getGenerateCodeAndURL = useGenerateCodeAndURLHook()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { register, handleSubmit, reset } = useForm<IReturnToWorkoutFormData>()
    const [storedData, setStoredData] = useState<IReturnToWorkoutFormData>()

    useEffect(() => {
        if (open) {
            setIsLoading(true)
            getGenerateCodeAndURL('KRIS_Protokol')
                .then((protocol) => {
                    setStoredData({ ...storedData, Gen_Profil_kod_metais: protocol.cicode ?? '', Gen_Profil_ref_id: protocol.ciurl ?? '' })
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <BaseModal isOpen={open} close={onClose}>
            <QueryFeedback loading={isLoading} withChildren>
                {storedData?.Gen_Profil_ref_id && (
                    <form onSubmit={handleSubmit(onSend)}>
                        <TextHeading size="L">{t('ciType.return_to_workout')}</TextHeading>
                        <TextArea {...register('note')} label={t('modalKris.returnToWorkout.note')} rows={3} />
                        <input type="hidden" {...register('Gen_Profil_kod_metais')} defaultValue={storedData?.Gen_Profil_kod_metais} />
                        <input type="hidden" {...register('Gen_Profil_ref_id')} defaultValue={storedData?.Gen_Profil_ref_id} />
                        <ModalButtons
                            submitButtonLabel={t('ciType.return')}
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
    )
}
