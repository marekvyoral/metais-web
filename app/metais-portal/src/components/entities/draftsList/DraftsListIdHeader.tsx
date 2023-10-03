import { Button, ButtonGroupRow, ButtonPopup, TextHeading } from '@isdd/idsk-ui-kit/index'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ApiStandardRequestRequestChannel } from '@isdd/metais-common/api/generated/standards-swagger'

interface Props {
    entityId: string
    entityItemName: string
    isLoading: boolean
    isError: boolean
}

export const DraftsListIdHeader: React.FC<Props> = ({ entityId, entityItemName, isLoading, isError }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const [openChangeStateDialog, setOpenChangeStateDialog] = useState<boolean>(false)
    const [targetState, setTargetState] = useState<ApiStandardRequestRequestChannel>()

    const onClick = (incomingState: ApiStandardRequestRequestChannel) => {
        setOpenChangeStateDialog(true)
        setTargetState(incomingState)
    }

    const handleChangeState = useCallback(async (attachementIds: string[], description: string) => {
        // await changeState({
        //     referenceRegisterUuid: entityId,
        //     data: {
        //         attachementIds,
        //         description,
        //         targetState,
        //     },
        // })
    }, [])

    return (
        <>
            {/* <MutationFeedback success={isSuccess} error={mutationIsError} /> */}
            {/* {mutationIsLoading && <LoadingIndicator />} */}
            <QueryFeedback loading={isLoading} error={isError}>
                <div className={styles.headerDiv}>
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
                                    return <div className={styles.buttonLinksDiv} />
                                }}
                            />
                        </Can>
                    </ButtonGroupRow>
                </div>
            </QueryFeedback>
        </>
    )
}
