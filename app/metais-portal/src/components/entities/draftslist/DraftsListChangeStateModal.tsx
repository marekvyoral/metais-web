import { BaseModal, Button, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import React, { useContext } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import styles from '@isdd/metais-common/components/export-items-or-relations/exportItemsOrRelations.module.scss'

import { StandardDraftsStateMachine } from '@/pages/standardization/draftslist/[entityId]/form'

interface IDraftsListChangeStateModal {
    openChangeStateDialog: boolean
    setOpenChangeStateDialog: (open: boolean) => void
    handleChangeState: (description: string) => Promise<void>
    targetState: StandardDraftsDraftStates | undefined
}

export const DraftsListChangeStateModal = ({
    openChangeStateDialog,
    setOpenChangeStateDialog,
    handleChangeState,
    targetState,
}: IDraftsListChangeStateModal) => {
    const { handleSubmit, register, reset } = useForm()
    const { t } = useTranslation()
    const standardDraftsStateMachineContext = useContext(StandardDraftsStateMachine)
    const machine = useStateMachine({ stateContext: standardDraftsStateMachineContext })
    const onSubmit = async (formValues: FieldValues) => {
        if (targetState) {
            await handleChangeState(formValues?.description)
            machine.changeState(targetState)
            reset()
            setOpenChangeStateDialog(false)
        }
    }

    return (
        <BaseModal isOpen={openChangeStateDialog} close={() => setOpenChangeStateDialog(false)}>
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <TextHeading size={'L'} className={styles.heading}>
                        {t(`DraftsList.header.${targetState}`)}
                    </TextHeading>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <>
                            <Input {...register('description')} label={t('DraftsList.header.changeState.description')} />

                            <div className={styles.confirmButton}>
                                <Button label={t('DraftsList.header.changeState.submit')} type="submit" />
                            </div>
                        </>
                    </form>
                </div>
            </div>
        </BaseModal>
    )
}
