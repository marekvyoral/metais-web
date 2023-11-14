import { Button, ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    ApiReferenceRegisterState,
    useDeleteReferenceRegister,
    useProcessRequestAction,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'

import { RefRegisterChangeStateModal } from '@/components/views/refregisters/RefRegisterChangeStateModal'
import { RefRegisterButtonPopupContent } from '@/components/views/refregisters/RefRegisterButtonPopupContent'
import { RefRegisterGeneratePropDialog } from '@/components/views/refregisters/RefRegisterGeneratePropDialog'

interface Props {
    entityId: string
    entityItemName: string
    isLoading: boolean
    isError: boolean
}

export const RefRegisterIdHeader: React.FC<Props> = ({ entityId, entityItemName, isLoading, isError }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const [openChangeStateDialog, setOpenChangeStateDialog] = useState<boolean>(false)
    const [openGeneratePropDialog, setOpenGeneratePropDialog] = useState<boolean>(false)
    const [targetState, setTargetState] = useState<ApiReferenceRegisterState>()
    const { mutateAsync: changeState, isSuccess, isError: mutationIsError, isLoading: mutationIsLoading } = useProcessRequestAction()
    const { mutateAsync: deleteReferenceRegister } = useDeleteReferenceRegister()

    const onClick = (incomingState: ApiReferenceRegisterState) => {
        setOpenChangeStateDialog(true)
        setTargetState(incomingState)
    }

    const handleChangeState = useCallback(
        async (attachementIds: string[], description: string) => {
            await changeState({
                referenceRegisterUuid: entityId,
                data: {
                    attachementIds,
                    description,
                    targetState,
                },
            })
        },
        [changeState, entityId, targetState],
    )

    const handleDeleteRefRegister = useCallback(async () => {
        await deleteReferenceRegister({
            referenceRegisterUuid: entityId,
        })
    }, [entityId, deleteReferenceRegister])

    return (
        <>
            <MutationFeedback success={isSuccess} error={mutationIsError} />
            {mutationIsLoading && <LoadingIndicator />}
            <div className={styles.headerDiv}>
                <RefRegisterChangeStateModal
                    openChangeStateDialog={openChangeStateDialog}
                    setOpenChangeStateDialog={setOpenChangeStateDialog}
                    entityId={entityId}
                    targetState={targetState}
                    handleChangeState={handleChangeState}
                />
                <RefRegisterGeneratePropDialog
                    openGeneratePropDialog={openGeneratePropDialog}
                    setOpenGeneratePropDialog={setOpenGeneratePropDialog}
                    entityId={entityId}
                />
                <QueryFeedback loading={isLoading} error={isError}>
                    <div className={styles.headerDiv}>
                        <TextHeading size="XL">{entityItemName}</TextHeading>

                        <ButtonGroupRow>
                            <Can I={Actions.EDIT} a={`refRegisters`}>
                                <Button
                                    label={t('ciType.editButton')}
                                    onClick={() => navigate(`/refRegisters/${entityId}/edit`, { state: location.state })}
                                />
                            </Can>
                            <Can I={Actions.CHANGE_STATES} a={`refRegisters`}>
                                <ButtonPopup
                                    buttonLabel={t('ciType.moreButton')}
                                    popupPosition="right"
                                    popupContent={() => {
                                        return (
                                            <div className={styles.buttonLinksDiv}>
                                                <RefRegisterButtonPopupContent
                                                    entityId={entityId}
                                                    setOpenGeneratePropDialog={setOpenGeneratePropDialog}
                                                    handleDeleteRefRegister={handleDeleteRefRegister}
                                                    onClick={onClick}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </Can>
                        </ButtonGroupRow>
                    </div>
                </QueryFeedback>
            </div>
        </>
    )
}
