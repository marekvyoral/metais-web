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
import { useInvalidateCiItemCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useSlaContractTransition } from '@isdd/metais-common/api/generated/monitoring-swagger'

import { SLA_STATE_TRANSITION, SlaActions } from '@/components/sla-actions/SlaActions'
import { CheckSlaParamsModal } from '@/components/check-sla-params-modal/CheckSlaParamsModal'

interface Props {
    entityName: string
    entityId: string
    entityItemName: string
    entityData?: ConfigurationItemUi
    ciRoles: string[]
    isInvalidated: boolean
    refetchCi: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ConfigurationItemUi, ApiError>>
    isRelation?: boolean
    editButton: React.ReactNode
    isLocked: boolean
}

export const SlaContractDetailHeader: React.FC<Props> = ({
    entityData,
    entityId,
    entityItemName,
    ciRoles,
    isInvalidated,
    refetchCi,
    isRelation,
    editButton,
    isLocked,
}) => {
    const { t } = useTranslation()
    const { invalidate: invalidateCiItemCache } = useInvalidateCiItemCache()
    //todo const { invalidate: invalidateDmsfileCache } = useInvalidateDmsFileCache()

    const { handleReInvalidate, handleInvalidate, errorMessage, isBulkLoading } = useBulkAction(isRelation)
    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()
    const [showUploadDoc, setShowUploadDoc] = useState<boolean>(false)
    const [showManuallySignDoc, setShowManuallySignDoc] = useState<boolean>(false)
    const [isCheckParamsOpen, setIsCheckParamsOpen] = useState<boolean>(false)

    const invalidateQueriesAfterSuccess = () => {
        invalidateCiItemCache(entityId)
        //todo invalidateDmsfileCache(entityId)
    }

    const {
        mutateAsync: changeSlaContractState,
        isLoading: isStateTransitionLoading,
        isError: isStateTransitionError,
        isSuccess: isStateTransitionSuccess,
    } = useSlaContractTransition({
        mutation: {
            onSuccess() {
                invalidateQueriesAfterSuccess()
            },
        },
    })

    const handleIterationStateTransition = (transition: SLA_STATE_TRANSITION) => {
        changeSlaContractState({ slaContractUuid: entityId, transition })
    }

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
        scrollToMutationFeedback()
    }, [bulkActionResult, scrollToMutationFeedback])

    return (
        <>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess || isStateTransitionError || isStateTransitionSuccess) && (
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success={bulkActionResult?.isSuccess || isStateTransitionSuccess}
                        successMessage={bulkActionResult?.successMessage}
                        error={bulkActionResult?.isError || isStateTransitionError ? t('feedback.mutationErrorMessage') : ''}
                    />
                </div>
            )}
            <div className={styles.headerDiv}>
                {(isBulkLoading || isStateTransitionLoading) && <LoadingIndicator fullscreen />}
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
                        popupContent={(close) => {
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
                                                    onClick={() => {
                                                        handleInvalidate(entityListData, () => setShowInvalidate(true), open)
                                                        close()
                                                    }}
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
                                                    onClick={() => {
                                                        handleReInvalidate(entityListData, () => setShowReInvalidate(true), open)
                                                        close()
                                                    }}
                                                    label={t('ciType.revalidateItem')}
                                                />
                                            </div>
                                        )}
                                    />

                                    <Can I={Actions.CHANGE_OWNER} a={`ci.${entityId}`}>
                                        <ButtonLink
                                            onClick={() => {
                                                setShowChangeOwner(true)
                                                close()
                                            }}
                                            label={t('ciType.changeOfOwner')}
                                        />
                                    </Can>

                                    <SlaActions
                                        entityId={entityId}
                                        type="slaContract"
                                        handleIterationStateTransition={handleIterationStateTransition}
                                        isLocked={isLocked}
                                        closePopup={close}
                                        setIsCheckParamsOpen={setIsCheckParamsOpen}
                                        setShowManuallySignDoc={setShowManuallySignDoc}
                                        setShowUploadDoc={setShowUploadDoc}
                                    />
                                </div>
                            )
                        }}
                    />
                </ButtonGroupRow>

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
                <CheckSlaParamsModal isOpen={isCheckParamsOpen} onClose={() => setIsCheckParamsOpen(false)} entityId={entityId} />

                {/*  <ProvIntegrationUploadDocModal
        entityName={entityName}
        header={t('integrationLinks.manualSign')}
        isOpen={showManuallySignDoc}
        onClose={() => setShowManuallySignDoc(false)}
        onUploadSuccess={() => handleIterationStateTransition(SLA_STATE_TRANSITION.MANUALY_SIGN)}
        entityId={entityId}
        metaisCode={entityData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais]}
        ownerGid={entityData?.owner ?? ''}
    />
    <ProvIntegrationUploadDocModal
        entityName={entityName}
        header={t('integrationLinks.uploadDoc')}
        isOpen={showUploadDoc}
        onClose={() => setShowUploadDoc(false)}
        onUploadSuccess={() => invalidateQueriesAfterSuccess()}
        entityId={entityId}
        metaisCode={entityData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais]}
        ownerGid={entityData?.owner ?? ''}
    />*/}
            </div>
        </>
    )
}
