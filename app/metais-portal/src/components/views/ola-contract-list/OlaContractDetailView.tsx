import { Button, ButtonLink, ButtonPopup, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi, getReadCiNeighboursWithAllRelsQueryKey } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import stylesPopup from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { OLA_CONTRACT_STATES, OLA_CONTRACT_STATE_ACTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { FileHistoryModal, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './olaContract.module.scss'
import { OlaContractDetailBasicInfo } from './OlaContractDetailBasicInfo'
import { OlaContractInvalidateModal } from './OlaContractInvalidateModal'
import { OlaContractRevalidateModal } from './OlaContractRevalidateModal'

import { IOlaContractDetailView } from '@/components/containers/OlaContractDetailContainer'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'

export const OlaContractDetailView: React.FC<IOlaContractDetailView> = ({
    isError,
    isLoading,
    olaContract,
    document,
    downloadVersionFile,
    refetch,
    showHistory,
    setShowHistory,
    isOwnerOfContract,
    canChange,
    moveState,
    canMoveState,
    statesEnum,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [invalidateShow, setInvalidateShow] = useState(false)
    const [revalidateShow, setRevalidateShow] = useState(false)
    const name = olaContract?.name
    const isInvalid = olaContract?.state == 'INVALIDATED'
    const queryClient = useQueryClient()
    const key = getReadCiNeighboursWithAllRelsQueryKey(olaContract?.uuid ?? '')
    const {
        state: { user },
    } = useAuth()

    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
    }, [isActionSuccess, scrollToMutationFeedback])

    const getDefaultActions = (closePopup: () => void) => [
        <ButtonLink
            disabled={isInvalid}
            key={'buttonBlock'}
            icon={CrossInACircleIcon}
            label={t('ciType.invalidateItem')}
            className={stylesPopup.buttonLinkWithIcon}
            onClick={() => {
                setInvalidateShow(true)
                closePopup()
            }}
        />,
        <ButtonLink
            disabled={!isInvalid}
            key={'buttonUnblock'}
            icon={CheckInACircleIcon}
            label={t('ciType.revalidateItem')}
            className={stylesPopup.buttonLinkWithIcon}
            onClick={() => {
                setRevalidateShow(true)
                closePopup()
            }}
        />,
    ]

    const getStateActions = (closePopup: () => void) => {
        if (!canMoveState || isInvalid) return []
        const currentState = olaContract?.profilState ?? OLA_CONTRACT_STATES.PLANNED
        switch (currentState) {
            case OLA_CONTRACT_STATES.PLANNED:
                return [
                    <ButtonLink
                        key={'APPROVE'}
                        label={t('olaContracts.stateActions.approve')}
                        className={stylesPopup.buttonLinkWithIcon}
                        onClick={() => {
                            moveState({ olaContractUuid: olaContract?.uuid ?? '', transition: OLA_CONTRACT_STATE_ACTIONS.APPROVE })
                            closePopup()
                        }}
                    />,
                    <ButtonLink
                        key={'RETURN'}
                        label={t('olaContracts.stateActions.return')}
                        className={stylesPopup.buttonLinkWithIcon}
                        onClick={() => {
                            moveState({ olaContractUuid: olaContract?.uuid ?? '', transition: OLA_CONTRACT_STATE_ACTIONS.RETURN })
                            closePopup()
                        }}
                    />,
                ]
            case OLA_CONTRACT_STATES.RETURNED:
                return [
                    <ButtonLink
                        key={'PLAN'}
                        label={t('olaContracts.stateActions.plan')}
                        className={stylesPopup.buttonLinkWithIcon}
                        onClick={() => {
                            moveState({ olaContractUuid: olaContract?.uuid ?? '', transition: OLA_CONTRACT_STATE_ACTIONS.PLAN })
                            closePopup()
                        }}
                    />,
                ]
            case OLA_CONTRACT_STATES.APPROVED:
                return [
                    <ButtonLink
                        key={'CONTRACT'}
                        label={t('olaContracts.stateActions.contract')}
                        className={stylesPopup.buttonLinkWithIcon}
                        onClick={() => {
                            moveState({ olaContractUuid: olaContract?.uuid ?? '', transition: OLA_CONTRACT_STATE_ACTIONS.CONTRACT })
                            closePopup()
                        }}
                    />,
                ]

            default:
                return []
        }
    }

    return (
        <>
            {document && (
                <FileHistoryModal
                    isOpen={showHistory}
                    item={{ uuid: olaContract?.uuid, attributes: [{ name: 'Gen_Profil_nazov', value: olaContract?.name }] } as ConfigurationItemUi}
                    onClose={() => setShowHistory(false)}
                />
            )}

            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <div ref={wrapperRef} />
                <MutationFeedback
                    success={isActionSuccess.value && isActionSuccess?.additionalInfo?.type == 'edit'}
                    successMessage={t('mutationFeedback.successfulUpdated')}
                />
                <MutationFeedback
                    success={isActionSuccess.value && isActionSuccess?.additionalInfo?.type == 'stateChanged'}
                    error={undefined}
                    successMessage={t('olaContracts.detail.stateChanged')}
                />
                <div className={styles.flexRowHeader}>
                    <TextHeading size="L" className={classNames({ [styles.invalidated]: isInvalid })}>
                        {t('olaContracts.detail.title', { name })}
                    </TextHeading>
                    {user && canChange && isOwnerOfContract && (
                        <div className={styles.flexRow}>
                            <Button
                                label={t('olaContracts.detail.edit')}
                                disabled={isInvalid}
                                onClick={() => navigate('./edit', { relative: 'path' })}
                            />
                            <div>
                                <div className={classNames(stylesPopup.mobileOrder3, stylesPopup.buttonPopup)} id="bulkActions">
                                    <ButtonPopup
                                        buttonLabel={t('actionOverTable.actions')}
                                        popupPosition="right"
                                        popupContent={(closePopup) => (
                                            <div className={stylesPopup.popupActions} id="bulkActionsList" role="list">
                                                {[...getDefaultActions(closePopup), ...getStateActions(closePopup)]}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <OlaContractDetailBasicInfo
                    statesEnum={statesEnum}
                    downloadVersionFile={downloadVersionFile}
                    document={document}
                    olaContract={olaContract}
                    setShowHistory={setShowHistory}
                />
                <RelationsListContainer
                    entityId={olaContract?.uuid ?? ''}
                    technicalName={'ISVS'}
                    showOnlyTabsWithRelations
                    hideButtons
                    includeDeleted
                />
            </QueryFeedback>
            <OlaContractInvalidateModal
                olaContract={olaContract}
                open={invalidateShow}
                close={() => setInvalidateShow(false)}
                onInvalidated={async () => {
                    setInvalidateShow(false)
                    await queryClient.invalidateQueries(key)
                    refetch().then(() => {
                        setIsActionSuccess({
                            value: true,
                            path: RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract?.uuid ?? '',
                            additionalInfo: { type: 'edit' },
                        })
                    })
                }}
            />
            <OlaContractRevalidateModal
                olaContract={olaContract}
                open={revalidateShow}
                close={() => setRevalidateShow(false)}
                onRevalidated={async () => {
                    setRevalidateShow(false)
                    await queryClient.invalidateQueries(key)
                    refetch().then(() => {
                        setIsActionSuccess({
                            value: true,
                            path: RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract?.uuid ?? '',
                            additionalInfo: { type: 'edit' },
                        })
                    })
                }}
            />
        </>
    )
}
