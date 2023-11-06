import { ProgressStepper } from '@isdd/idsk-ui-kit/index'
import React from 'react'

import { IView } from '@/components/containers/ProjectStateContainer'

export const ProjectStateView: React.FC<IView> = ({ steps, currentStep, isLoading }) => {
    return <ProgressStepper steps={steps} currentStep={currentStep} isLoading={isLoading} />
}
