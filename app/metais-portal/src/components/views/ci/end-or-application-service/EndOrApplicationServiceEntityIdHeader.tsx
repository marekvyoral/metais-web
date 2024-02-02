import { ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ApiError, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ChangeOwnerBulkModal, InvalidateBulkModal, MutationFeedback, ReInvalidateBulkModal } from '@isdd/metais-common/index'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

interface Props {
    entityId: string
    entityItemName: string
    entityData?: ConfigurationItemUi
    ciRoles: string[]
    isInvalidated: boolean
    clonePath: string
    refetchCi: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ConfigurationItemUi, ApiError>>
    isRelation?: boolean
    editButton: React.ReactNode
    tooltipLabel: string
}

export const EndOrApplicationServiceEntityIdHeader: React.FC<Props> = ({
    entityData,
    entityId,
    entityItemName,
    ciRoles,
    isInvalidated,
    clonePath,
    refetchCi,
    isRelation,
    editButton,
    tooltipLabel,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const { handleReInvalidate, handleInvalidate, handleClone, errorMessage, isBulkLoading } = useBulkAction(isRelation)
    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const handleBulkAction = (actionResult: IBulkActionResult) => {
        setBulkActionResult(actionResult)
        refetchCi()
    }

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        handleBulkAction(actionResult)
    }

    const entityListData = entityData ? [entityData] : []
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (bulkActionResult?.isError || bulkActionResult?.isSuccess) {
            scrollToMutationFeedback()
        }
    }, [bulkActionResult, scrollToMutationFeedback])

    return (
        <>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success={bulkActionResult?.isSuccess}
                        successMessage={bulkActionResult?.successMessage}
                        error={bulkActionResult?.isError ? t('feedback.mutationErrorMessage') : ''}
                        onMessageClose={() => setBulkActionResult(undefined)}
                    />
                </div>
            )}
            <div className={styles.headerDiv}>
                {isBulkLoading && <LoadingIndicator fullscreen />}
                <TextHeading size="XL" className={classNames({ [styles.invalidated]: isInvalidated })}>
                    {entityItemName}
                </TextHeading>
                <ButtonGroupRow>
                    <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                        {editButton}
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
                                                    disabled={isInvalidated}
                                                    onClick={() => handleInvalidate(entityListData, () => setShowInvalidate(true), open)}
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
                                                    disabled={!isInvalidated}
                                                    onClick={() => handleReInvalidate(entityListData, () => setShowReInvalidate(true), open)}
                                                    label={t('ciType.revalidateItem')}
                                                />
                                            </div>
                                        )}
                                    />

                                    <Can I={Actions.CHANGE_OWNER} a={`ci.${entityId}`}>
                                        <ButtonLink onClick={() => setShowChangeOwner(true)} label={t('ciType.changeOfOwner')} />
                                    </Can>

                                    <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                                        <Tooltip
                                            key={'cloneCI'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={() => (
                                                <div>
                                                    <ButtonLink
                                                        onClick={() =>
                                                            handleClone(entityData, () => navigate(clonePath, { state: location.state }), open)
                                                        }
                                                        label={tooltipLabel}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </Can>
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
                    isRelation={isRelation}
                />
                <ReInvalidateBulkModal
                    items={entityListData}
                    open={showReInvalidate}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                    onClose={() => setShowReInvalidate(false)}
                    isRelation={isRelation}
                />
                <ChangeOwnerBulkModal
                    items={entityListData}
                    open={showChangeOwner}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                    onClose={() => setShowChangeOwner(false)}
                    ciRoles={ciRoles}
                    isRelation={isRelation}
                />
            </div>
        </>
    )
}
