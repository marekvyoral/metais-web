import { ButtonLink } from '@isdd/idsk-ui-kit/index'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Can, ExtendedAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { SlaAction } from '@isdd/metais-common/hooks/permissions/useSlaContractPermissions'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import { CheckSlaParamsModal } from '../check-sla-params-modal/CheckSlaParamsModal'

export enum SLA_STATE_TRANSITION {
    REVERT_MANUAL_SIGN = 'REVERT_MANUAL_SIGN',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    MANUALY_SIGN = 'MANUALY_SIGN',
    SIGN = 'SIGN',
    LOCK = 'LOCK',
    UNLOCK = 'UNLOCK',
}

type Props = {
    entityId: string
    type: 'slaContract' | 'integrationLink'
    handleIterationStateTransition: (transition: SLA_STATE_TRANSITION) => void
    isLocked: boolean
    closePopup: () => void
    setShowUploadDoc: Dispatch<SetStateAction<boolean>>
    setShowManuallySignDoc: Dispatch<SetStateAction<boolean>>
    setIsCheckParamsOpen: Dispatch<SetStateAction<boolean>>
}

export const SlaActions: React.FC<Props> = ({
    entityId,
    type,
    handleIterationStateTransition,
    isLocked,
    closePopup,
    setShowUploadDoc,
    setShowManuallySignDoc,
    setIsCheckParamsOpen,
}) => {
    const { t } = useTranslation()

    return (
        <>
            <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        setShowUploadDoc(true)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.uploadDoc')}
                />
            </Can>
            <Can I={SlaAction.MANUALLY_SIGN} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        setShowManuallySignDoc(true)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.manualSign')}
                />
            </Can>
            <Can I={SlaAction.REVERT_MANUAL_SIGN} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        handleIterationStateTransition(SLA_STATE_TRANSITION.REVERT_MANUAL_SIGN)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.cancelManualSignature')}
                />
            </Can>
            <Can I={SlaAction.CONS_APPROVE} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        handleIterationStateTransition(SLA_STATE_TRANSITION.APPROVE)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.approveConsumer')}
                />
            </Can>
            <Can I={SlaAction.PROV_APPROVE} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        handleIterationStateTransition(SLA_STATE_TRANSITION.APPROVE)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.approveProvider')}
                />
            </Can>

            <Can I={SlaAction.CONS_SIGN} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        handleIterationStateTransition(SLA_STATE_TRANSITION.SIGN)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.signConsumer')}
                />
            </Can>
            <Can I={SlaAction.PROV_SIGN} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        handleIterationStateTransition(SLA_STATE_TRANSITION.SIGN)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.signProvider')}
                />
            </Can>
            <Can I={SlaAction.REJECT} a={`ci.${entityId}`}>
                <ButtonLink
                    onClick={() => {
                        handleIterationStateTransition(SLA_STATE_TRANSITION.REJECT)
                        closePopup()
                    }}
                    label={t('slaContracts.actions.reject')}
                />
            </Can>

            {type == 'slaContract' && (
                <>
                    <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                        <ButtonLink
                            onClick={() => {
                                isLocked
                                    ? handleIterationStateTransition(SLA_STATE_TRANSITION.UNLOCK)
                                    : handleIterationStateTransition(SLA_STATE_TRANSITION.LOCK)
                                closePopup()
                            }}
                            label={isLocked ? t('slaContracts.actions.unlock') : t('slaContracts.actions.lock')}
                        />
                    </Can>
                    <ButtonLink
                        onClick={() => {
                            setIsCheckParamsOpen(true)
                            closePopup()
                        }}
                        label={t('slaContracts.actions.checkParams')}
                    />
                </>
            )}
        </>
    )
}
