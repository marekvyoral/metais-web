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
import { MutationFeedback, QueryFeedback, QueryKeysByEntity } from '@isdd/metais-common/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useQueryClient } from '@tanstack/react-query'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

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
    const {
        state: { user },
    } = useAuth()
    const isLoggedIn = !!user?.uuid
    const [openChangeStateDialog, setOpenChangeStateDialog] = useState<boolean>(false)
    const [openGeneratePropDialog, setOpenGeneratePropDialog] = useState<boolean>(false)
    const { setIsActionSuccess } = useActionSuccess()
    const queryClient = useQueryClient()
    const { getRequestStatus, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading, isTooManyFetchesError } = useGetStatus()
    const [targetState, setTargetState] = useState<ApiReferenceRegisterState>()
    const {
        mutateAsync: changeState,
        isSuccess,
        isError: mutationIsError,
        isLoading: mutationIsLoading,
    } = useProcessRequestAction({
        mutation: {
            onSuccess: (data) => {
                getRequestStatus(data.requestId ?? '', () => {
                    setIsActionSuccess({
                        value: true,
                        path: `${RouterRoutes.REF_REGISTERS_DETAIL}/${entityId}`,
                        additionalInfo: { type: 'changeState' },
                    })
                    queryClient.invalidateQueries([QueryKeysByEntity.REFERENCE_REGISTER])
                })
            },
        },
    })
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

            queryClient.invalidateQueries([QueryKeysByEntity.REFERENCE_REGISTER])
        },
        [changeState, entityId, queryClient, targetState],
    )

    const handleDeleteRefRegister = useCallback(async () => {
        await deleteReferenceRegister({
            referenceRegisterUuid: entityId,
        })
    }, [entityId, deleteReferenceRegister])

    return (
        <>
            <MutationFeedback success={isSuccess} error={mutationIsError || isProcessedError || isRedirectError || isTooManyFetchesError} />
            {(mutationIsLoading || isRedirectLoading) && <LoadingIndicator />}
            <div className={styles.headerDiv}>
                <RefRegisterChangeStateModal
                    openChangeStateDialog={openChangeStateDialog}
                    setOpenChangeStateDialog={setOpenChangeStateDialog}
                    entityId={entityId}
                    targetState={targetState}
                    handleChangeState={handleChangeState}
                    entityItemName={entityItemName}
                />
                <RefRegisterGeneratePropDialog
                    openGeneratePropDialog={openGeneratePropDialog}
                    setOpenGeneratePropDialog={setOpenGeneratePropDialog}
                    entityId={entityId}
                />
                <QueryFeedback loading={isLoading} error={isError}>
                    <div className={styles.headerDiv}>
                        <TextHeading size="XL">{entityItemName}</TextHeading>

                        {isLoggedIn && (
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
                                        popupContent={(closePopup) => {
                                            return (
                                                <div className={styles.buttonLinksDiv}>
                                                    <RefRegisterButtonPopupContent
                                                        entityId={entityId}
                                                        setOpenGeneratePropDialog={setOpenGeneratePropDialog}
                                                        handleDeleteRefRegister={handleDeleteRefRegister}
                                                        onClick={(option) => {
                                                            onClick(option)
                                                            closePopup()
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    />
                                </Can>
                            </ButtonGroupRow>
                        )}
                    </div>
                </QueryFeedback>
            </div>
        </>
    )
}
