import { ProgressStepper } from '@isdd/idsk-ui-kit/index'
import React from 'react'

import { IView } from '@/components/containers/ProjectStateContainer'

export const ProjectStateView: React.FC<IView> = ({ steps, currentStep }) => {
    return <ProgressStepper steps={steps} currentStep={currentStep} />
}