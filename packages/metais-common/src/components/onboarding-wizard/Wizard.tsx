import React, { SetStateAction } from 'react'
import Joyride, { Step, CallBackProps, ACTIONS, STATUS } from 'react-joyride'

import { WizardTooltip } from './WizardTooltip'

import { WizardTypes, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

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

    const defaultCallback = (data: CallBackProps) => {
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.FINISHED) {
            updateUserPreferences({ ...currentPreferences, [type]: false })
        }
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.RUNNING) {
            setState({ ...state, run: false })
        }
    }

    return (
        <>
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
            />
        </>
    )
}
