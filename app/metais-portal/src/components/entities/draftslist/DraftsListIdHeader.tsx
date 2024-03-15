import { Button, ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import {
    ApiStandardRequestPreviewRequestChannel,
    useActionStandardRequest,
    useAssignStandardRequest,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { MutationFeedback } from '@isdd/metais-common/index'
import { FieldValues } from 'react-hook-form'
import { useInvalidateCodeListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { DraftsListButtonPopupContent } from '@/components/entities/draftslist/DraftsListButtonPopupContent'
import { DraftsListChangeStateModal } from '@/components/entities/draftslist/DraftsListChangeStateModal'
import { DraftsListAssignToPSDialog } from '@/components/entities/draftslist/DraftsListAssignToPSDialog'
import { transformTargetStateIntoAction } from '@/componentHelpers/draftsList'

interface Props {
    entityId: string
    entityItemName: string
    requestChannel: string
}

export const DraftsListIdHeader: React.FC<Props> = ({ entityId, entityItemName, requestChannel }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { invalidateAll: invalidateCodelists } = useInvalidateCodeListCache()
    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const [openChangeStateDialog, setOpenChangeStateDialog] = useState<boolean>(false)
    const [targetState, setTargetState] = useState<StandardDraftsDraftStates>()
    const {
        mutateAsync: changeState,
        isSuccess: mutationIsSuccess,
        isError: mutationIsError,
        isLoading: mutationIsLoading,
    } = useActionStandardRequest()

    const { mutateAsync: assignToPS, isLoading, isSuccess, isError } = useAssignStandardRequest()

    const onClick = (incomingState: StandardDraftsDraftStates) => {
        if (incomingState !== StandardDraftsDraftStates.ASSIGNED) setOpenChangeStateDialog(true)
        setTargetState(incomingState)
    }

    const closeDialog = () => {
        setTargetState(undefined)
    }

    const handleChangeState = useCallback(
        async (description: string) => {
            setOpenChangeStateDialog(false)
            await changeState({
                standardRequestId: parseInt(entityId ?? ''),
                data: {
                    description: description,
                },
                params: {
                    action: transformTargetStateIntoAction(targetState as StandardDraftsDraftStates),
                },
            })

            if (
                requestChannel === ApiStandardRequestPreviewRequestChannel.ZC_Header ||
                requestChannel === ApiStandardRequestPreviewRequestChannel.ZC_Request
            ) {
                invalidateCodelists()
            }
        },
        [changeState, entityId, invalidateCodelists, requestChannel, targetState],
    )
    const handleAssignToPS = useCallback(
        async (values: FieldValues) => {
            closeDialog()
            await assignToPS({
                groupId: values?.workGroupId,
                standardRequestId: parseInt(entityId),
            })
        },
        [assignToPS, entityId],
    )

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <>
            <MutationFeedback
                success={mutationIsSuccess || isSuccess || isActionSuccess.value}
                error={mutationIsError || isError}
                successMessage={isActionSuccess?.additionalInfo?.type == 'create' ? t('mutationFeedback.successfulCreated') : undefined}
            />

            <div ref={wrapperRef} />
            {(mutationIsLoading || isLoading) && <LoadingIndicator label={t('feedback.saving')} />}
            <div className={styles.headerDiv}>
                <DraftsListChangeStateModal
                    openChangeStateDialog={openChangeStateDialog}
                    setOpenChangeStateDialog={setOpenChangeStateDialog}
                    handleChangeState={handleChangeState}
                    targetState={targetState}
                />
                <DraftsListAssignToPSDialog
                    openAddToPSDialog={targetState === StandardDraftsDraftStates.ASSIGNED}
                    setOpenAddToPSDialog={closeDialog}
                    assignToPs={handleAssignToPS}
                />
                <TextHeading size="XL">{entityItemName}</TextHeading>
                <ButtonGroupRow>
                    <Can I={Actions.EDIT} a={`DraftsList`}>
                        <Button
                            label={t('ciType.editButton')}
                            onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${entityId}/edit`, { state: location.state })}
                        />
                    </Can>
                    <Can I={Actions.CHANGE_STATES} a={`DraftsList`}>
                        <ButtonPopup
                            buttonLabel={t('ciType.moreButton')}
                            popupPosition="right"
                            popupContent={() => {
                                return (
                                    <div className={styles.buttonLinksDiv}>
                                        <DraftsListButtonPopupContent onClick={onClick} />
                                    </div>
                                )
                            }}
                        />
                    </Can>
                </ButtonGroupRow>
            </div>
        </>
    )
}
