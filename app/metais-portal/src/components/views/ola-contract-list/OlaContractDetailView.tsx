import { Button, ButtonLink, TextHeading } from '@isdd/idsk-ui-kit/index'
import { CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { BulkPopup, FileHistoryModal, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfigurationItemUi, getReadCiNeighboursWithAllRelsQueryKey } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { OLA_CONTRACT_STATES, OLA_CONTRACT_STATE_ACTIONS } from '@isdd/metais-common/constants'

import { OlaContractDetailBasicInfo } from './OlaContractDetailBasicInfo'
import { OlaContractInvalidateModal } from './OlaContractInvalidateModal'
import styles from './olaContract.module.scss'
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
                        onClick={() => {
                            moveState({ olaContractUuid: olaContract?.uuid ?? '', transition: OLA_CONTRACT_STATE_ACTIONS.APPROVE })
                            closePopup()
                        }}
                    />,
                    <ButtonLink
                        key={'RETURN'}
                        label={t('olaContracts.stateActions.return')}
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
                            <BulkPopup
                                popupPosition="right"
                                checkedRowItems={0}
                                items={(closePopup) => [...getDefaultActions(closePopup), ...getStateActions(closePopup)]}
                            />
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
