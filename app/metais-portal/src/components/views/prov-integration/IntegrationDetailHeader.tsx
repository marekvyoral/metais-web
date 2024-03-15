import { ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ApiError, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { Can, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { ATTRIBUTE_NAME, ChangeOwnerBulkModal, InvalidateBulkModal, MutationFeedback, ReInvalidateBulkModal } from '@isdd/metais-common/index'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvalidateCiItemCache, useInvalidateDmsFileCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'
import { IntegrationLinkActions } from '@isdd/metais-common/hooks/permissions/useEditIntegrationPermissions'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useChangeIntegrationState } from '@isdd/metais-common/api/generated/provisioning-swagger'

import { ProvIntegrationUploadDocModal } from './ProvIntegrationUploadDocModal'

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
}

enum STATE_TRANSITIONS {
    REVERT_MANUAL_SIGN = 'REVERT_MANUAL_SIGN',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    MANUALY_SIGN = 'MANUALY_SIGN',
    SIGN = 'SIGN',
}

export const IntegrationDetailHeader: React.FC<Props> = ({
    entityData,
    entityId,
    entityItemName,
    ciRoles,
    isInvalidated,
    refetchCi,
    isRelation,
    editButton,
    entityName,
}) => {
    const { t } = useTranslation()
    const ability = useAbilityContext()
    const {
        state: { token },
    } = useAuth()
    const { invalidate: invalidateCiItemCache } = useInvalidateCiItemCache()
    const { invalidate: invalidateDmsfileCache } = useInvalidateDmsFileCache()

    const { handleReInvalidate, handleInvalidate, errorMessage, isBulkLoading } = useBulkAction(isRelation)
    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)
    const [showUploadDoc, setShowUploadDoc] = useState<boolean>(false)
    const [showManuallySignDoc, setShowManuallySignDoc] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const invalidateQueriesAfterSuccess = () => {
        invalidateCiItemCache(entityId)
        invalidateDmsfileCache(entityId)
    }

    const {
        mutateAsync: changeIntegrationState,
        isError,
        isLoading,
        isSuccess,
    } = useChangeIntegrationState({
        mutation: {
            onSuccess() {
                invalidateQueriesAfterSuccess()
            },
        },
    })

    const handleIterationStateTransition = async (transition: STATE_TRANSITIONS) => {
        changeIntegrationState({ integrationUuid: entityId, transition })
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

    return (
        <>
            <ElementToScrollTo trigger={bulkActionResult?.isError || bulkActionResult?.isSuccess || isError || isSuccess}>
                <MutationFeedback
                    success={bulkActionResult?.isSuccess || isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError || isError}
                />
            </ElementToScrollTo>
            <div className={styles.headerDiv}>
                {(isBulkLoading || isLoading) && <LoadingIndicator fullscreen />}
                <TextHeading size="XL" className={classNames({ [styles.invalidated]: isInvalidated })}>
                    {entityItemName}
                </TextHeading>

                <ButtonGroupRow>
                    <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                        {editButton}
                    </Can>
                    {token && (
                        <ButtonPopup
                            buttonClassName={styles.noWrap}
                            buttonLabel={t('ciType.moreButton')}
                            popupPosition="right"
                            popupContent={(close) => {
                                const canChangeValidity = ability.can(Actions.CHANGE_VALIDITY, `ci.${entityId}`)
                                return (
                                    <div className={styles.buttonLinksDiv}>
                                        <Tooltip
                                            key={'invalidateItem'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={(open) => (
                                                <ButtonLink
                                                    disabled={isInvalidated || !canChangeValidity}
                                                    onClick={() => {
                                                        handleInvalidate(entityListData, () => setShowInvalidate(true), open)
                                                        close()
                                                    }}
                                                    label={t('ciType.invalidateItem')}
                                                />
                                            )}
                                        />
                                        <Tooltip
                                            key={'revalidateItem'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={(open) => (
                                                <ButtonLink
                                                    disabled={!isInvalidated || !canChangeValidity}
                                                    onClick={() => {
                                                        handleReInvalidate(entityListData, () => setShowReInvalidate(true), open)
                                                        close()
                                                    }}
                                                    label={t('ciType.revalidateItem')}
                                                />
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

                                        <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                                            <ButtonLink
                                                onClick={() => {
                                                    setShowUploadDoc(true)
                                                    close()
                                                }}
                                                label={t('integrationLinks.uploadDoc')}
                                            />
                                        </Can>

                                        <Can I={IntegrationLinkActions.MANUALLY_SIGN} a={`ci.${entityId}`}>
                                            <ButtonLink
                                                onClick={() => {
                                                    setShowManuallySignDoc(true)
                                                    close()
                                                }}
                                                label={t('integrationLinks.manualSign')}
                                            />
                                        </Can>

                                        <Can I={IntegrationLinkActions.REVERT_MANUAL_SIGN} a={`ci.${entityId}`}>
                                            <ButtonLink
                                                onClick={() => {
                                                    handleIterationStateTransition(STATE_TRANSITIONS.REVERT_MANUAL_SIGN)
                                                    close()
                                                }}
                                                label={t('integrationLinks.cancelManualSignature')}
                                            />
                                        </Can>

                                        <Can I={IntegrationLinkActions.APPROVE} a={`ci.${entityId}`}>
                                            <ButtonLink
                                                onClick={() => {
                                                    handleIterationStateTransition(STATE_TRANSITIONS.APPROVE)
                                                    close()
                                                }}
                                                label={t('integrationLinks.approve')}
                                            />
                                        </Can>

                                        <Can I={IntegrationLinkActions.SIGN} a={`ci.${entityId}`}>
                                            <ButtonLink
                                                onClick={() => {
                                                    handleIterationStateTransition(STATE_TRANSITIONS.SIGN)
                                                    close()
                                                }}
                                                label={t('integrationLinks.sign')}
                                            />
                                        </Can>

                                        <Can I={IntegrationLinkActions.REJECT} a={`ci.${entityId}`}>
                                            <ButtonLink
                                                onClick={() => {
                                                    handleIterationStateTransition(STATE_TRANSITIONS.REJECT)
                                                    close()
                                                }}
                                                label={t('integrationLinks.reject')}
                                            />
                                        </Can>
                                    </div>
                                )
                            }}
                        />
                    )}
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
                <ProvIntegrationUploadDocModal
                    entityName={entityName}
                    header={t('integrationLinks.manualSign')}
                    isOpen={showManuallySignDoc}
                    onClose={() => setShowManuallySignDoc(false)}
                    onUploadSuccess={() => handleIterationStateTransition(STATE_TRANSITIONS.MANUALY_SIGN)}
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
                />
            </div>
        </>
    )
}
