import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button, ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { ChangeOwnerBulkModal, InvalidateBulkModal, ReInvalidateBulkModal } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './ciEntityHeader.module.scss'

interface Props {
    entityName: string
    entityId: string
    entityItemName: string
    entityData?: ConfigurationItemUi
    handleBulkAction: (actionResult: IBulkActionResult) => void
}

export const CiEntityIdHeader: React.FC<Props> = ({ entityData, entityName, entityId, entityItemName, handleBulkAction }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const { handleReInvalidate, handleInvalidate, errorMessage, isBulkLoading } = useBulkAction()
    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)

    const entityListData = entityData ? [entityData] : []

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        handleBulkAction(actionResult)
    }

    return (
        <div className={styles.headerDiv}>
            <TextHeading size="XL">{entityItemName}</TextHeading>
            <ButtonGroupRow>
                <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                    <Button
                        label={t('ciType.editButton')}
                        onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                    />
                </Can>
                <ButtonPopup
                    buttonClassName={styles.noWrap}
                    buttonLabel={t('ciType.moreButton')}
                    popupPosition="right"
                    popupContent={() => {
                        return (
                            <div className={styles.buttonLinksDiv}>
                                <Tooltip
                                    key={'invalidateItem'}
                                    descriptionElement={errorMessage}
                                    position={'top center'}
                                    on={'right-click'}
                                    tooltipContent={(open) => (
                                        <div>
                                            <ButtonLink
                                                onClick={() => handleInvalidate(entityListData, setShowInvalidate, open)}
                                                label={t('ciType.invalidateItem')}
                                            />
                                        </div>
                                    )}
                                />
                                <Tooltip
                                    key={'revalidateItem'}
                                    descriptionElement={errorMessage}
                                    position={'top center'}
                                    tooltipContent={(open) => (
                                        <div>
                                            <ButtonLink
                                                onClick={() => handleReInvalidate(entityListData, setShowReInvalidate, open)}
                                                label={t('ciType.revalidateItem')}
                                            />
                                        </div>
                                    )}
                                />

                                <Can I={Actions.CHANGE_OWNER} a={`ci.${entityId}`}>
                                    <ButtonLink onClick={() => setShowChangeOwner(true)} label={t('ciType.changeOfOwner')} />
                                </Can>
                                <ButtonLink label={t('ciType.besManagement')} />
                            </div>
                        )
                    }}
                />
            </ButtonGroupRow>
            {isBulkLoading && <LoadingIndicator fullscreen />}

            <InvalidateBulkModal
                items={entityListData}
                open={showInvalidate}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                onClose={() => setShowInvalidate(false)}
            />
            <ReInvalidateBulkModal
                items={entityListData}
                open={showReInvalidate}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                onClose={() => setShowReInvalidate(false)}
            />
            <ChangeOwnerBulkModal
                items={entityListData}
                open={showChangeOwner}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                onClose={() => setShowChangeOwner(false)}
            />
        </div>
    )
}
