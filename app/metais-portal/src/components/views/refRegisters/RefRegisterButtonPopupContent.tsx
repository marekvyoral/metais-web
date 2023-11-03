import { ButtonLink } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { EDIT_CONTACT } from '@isdd/metais-common/navigation/searchKeys'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import { getPopupContent } from '@/componentHelpers/refRegisters/helpers'
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
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <>
            <Can I={Actions.DELETE} a={'refRegisters'}>
                <ButtonLink label={t('refRegisters.header.delete')} withoutFocus onClick={handleDeleteRefRegister} />
            </Can>
            {getPopupContent(allPosibleSteps, t, onClick)}

            <Can I={Actions.CREATE} a={'refRegisters.changeManagerInfo'}>
                <ButtonLink
                    label={t('refRegisters.header.changeManagerInfo')}
                    onClick={() => navigate(`/refRegisters/${entityId}/edit`)}
                    withoutFocus
                />
            </Can>
            <Can I={Actions.CREATE} a={'refRegisters.changeContact'}>
                <ButtonLink
                    label={t('refRegisters.header.changeContact')}
                    onClick={() => navigate({ pathname: `/refRegisters/${entityId}/edit`, search: `?${EDIT_CONTACT}=true` })}
                    withoutFocus
                />
            </Can>
            <Can I={Actions.CREATE} a={'refRegisters.generateProposition'}>
                <ButtonLink label={t('refRegisters.header.generateProposition')} onClick={() => setOpenGeneratePropDialog(true)} withoutFocus />
            </Can>
        </>
    )
}
