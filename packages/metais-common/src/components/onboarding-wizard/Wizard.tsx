import React, { SetStateAction } from 'react'
import Joyride, { Step, CallBackProps, ACTIONS } from 'react-joyride'
import { useTranslation } from 'react-i18next'

import { WizardTooltip } from './WizardTooltip'

import { WizardTypes, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { looseFocus } from '@isdd/metais-common/componentHelpers'

export interface WizardState {
    run: boolean
    steps: Step[]
}

export interface WizardProps {
    state: WizardState
    setState: React.Dispatch<SetStateAction<WizardState>>
    callback?: (data: CallBackProps) => void
    type: WizardTypes
}

export const Wizard: React.FC<WizardProps> = ({ state, setState, callback, type }) => {
    const { currentPreferences, updateUserPreferences } = useUserPreferences()
    const { t } = useTranslation()

    const defaultCallback = (data: CallBackProps) => {
        if (data.action === ACTIONS.CLOSE) {
            updateUserPreferences({ ...currentPreferences, [type]: false })
            setState({ ...state, run: false })
            looseFocus()
        }
    }

    return (
        <Joyride
            run={state.run}
            steps={state.steps}
            showProgress
            continuous
            scrollToFirstStep
            disableOverlay
            disableOverlayClose
            tooltipComponent={WizardTooltip}
            callback={callback ? callback : defaultCallback}
            locale={{
                back: t('wizard.actions.back'),
                close: t('wizard.actions.close'),
                last: t('wizard.actions.next'),
                next: t('wizard.actions.next'),
                open: t('wizard.actions.open'),
                skip: t('wizard.actions.skip'),
            }}
        />
    )
}
