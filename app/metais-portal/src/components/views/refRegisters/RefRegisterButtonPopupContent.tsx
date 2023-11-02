import { ButtonLink } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { EDIT_CONTACT } from '@isdd/metais-common/navigation/searchKeys'

import { getPopupContent, showChangeDataOfManager } from '@/componentHelpers/refRegisters/helpers'
import { RefRegisterStateMachine } from '@/pages/refRegisters/[entityId]'

interface IRefRegisterButtonPopupContent {
    entityId: string
    setOpenGeneratePropDialog: (open: boolean) => void
    handleDeleteRefRegister: () => Promise<void>
    onClick: (option: ApiReferenceRegisterState) => void
}

export const RefRegisterButtonPopupContent = ({
    setOpenGeneratePropDialog,
    entityId,
    onClick,
    handleDeleteRefRegister,
}: IRefRegisterButtonPopupContent) => {
    const refRegisterStateContext = useContext(RefRegisterStateMachine)
    const machine = useStateMachine({ stateContext: refRegisterStateContext })

    const allPosibleSteps = machine?.getAllPosibleTransitions<ApiReferenceRegisterState>()
    const currentState = machine.getCurrentState()
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <>
            {currentState === ApiReferenceRegisterState.IN_CONSTRUCTION && (
                <ButtonLink label={t('refRegisters.header.delete')} withoutFocus onClick={handleDeleteRefRegister} />
            )}
            {getPopupContent(allPosibleSteps, t, onClick)}

            {showChangeDataOfManager(currentState) && (
                <ButtonLink
                    label={t('refRegisters.header.changeManagerInfo')}
                    onClick={() => navigate(`/refRegisters/${entityId}/edit`)}
                    withoutFocus
                />
            )}
            <ButtonLink
                label={t('refRegisters.header.changeContact')}
                onClick={() => navigate({ pathname: `/refRegisters/${entityId}/edit`, search: `?${EDIT_CONTACT}=true` })}
                withoutFocus
            />
            {currentState !== ApiReferenceRegisterState.REJECTED && (
                <ButtonLink label={t('refRegisters.header.generateProposition')} onClick={() => setOpenGeneratePropDialog(true)} withoutFocus />
            )}
        </>
    )
}
