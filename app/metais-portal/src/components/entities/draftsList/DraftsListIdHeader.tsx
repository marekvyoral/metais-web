import { Button, ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { useActionStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { MutationFeedback } from '@isdd/metais-common/index'

import { DraftsListButtonPopupContent } from './DraftsListButtonPopupContent'
import { DraftsListChangeStateModal } from './DraftsListChangeStateModal'

import { transformTargetStateIntoAction } from '@/componentHelpers/draftsList'

interface Props {
    entityId: string
    entityItemName: string
}

export const DraftsListIdHeader: React.FC<Props> = ({ entityId, entityItemName }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const [openChangeStateDialog, setOpenChangeStateDialog] = useState<boolean>(false)
    const [targetState, setTargetState] = useState<StandardDraftsDraftStates>()
    const {
        mutateAsync: changeState,
        isSuccess: mutationIsSuccess,
        isError: mutationIsError,
        isLoading: mutationIsLoading,
    } = useActionStandardRequest()

    const onClick = (incomingState: StandardDraftsDraftStates) => {
        setOpenChangeStateDialog(true)
        setTargetState(incomingState)
    }

    const handleChangeState = useCallback(
        async (description: string) => {
            await changeState({
                standardRequestId: parseInt(entityId ?? ''),
                data: {
                    description: description,
                },
                params: {
                    action: transformTargetStateIntoAction(targetState as StandardDraftsDraftStates),
                },
            })
        },
        [changeState, entityId, targetState],
    )

    return (
        <>
            <MutationFeedback success={mutationIsSuccess} error={mutationIsError ? t('feedback.mutationErrorMessage') : undefined} />
            {mutationIsLoading && <LoadingIndicator />}
            <div className={styles.headerDiv}>
                <DraftsListChangeStateModal
                    openChangeStateDialog={openChangeStateDialog}
                    setOpenChangeStateDialog={setOpenChangeStateDialog}
                    handleChangeState={handleChangeState}
                    targetState={targetState}
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
