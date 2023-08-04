import React, { useId } from 'react'
import classnames from 'classnames'

import { StepperArrayEnum } from './Stepper'

interface IStepLabel {
    label: string
    variant: 'circle' | 'no-outline'
}

export interface ISection {
    title: string
    last?: boolean
    isTitle?: boolean
    stepLabel?: IStepLabel
    content?: React.ReactNode
}

interface IStepperSection {
    sectionArray: number[]
    setSectionArray: React.Dispatch<React.SetStateAction<StepperArrayEnum[]>>
    section: ISection
    index: number
}

export const StepperSection: React.FC<IStepperSection> = ({ section, sectionArray, index, setSectionArray }) => {
    const currentSection = sectionArray.at(index)
    const uniqueId = `expand-section${useId()}`

    const handleOpen = () => {
        const updatedArray = [...sectionArray]
        if (updatedArray.at(index) === StepperArrayEnum.EXPANDED) {
            updatedArray[index] = StepperArrayEnum.CLOSED
        } else {
            updatedArray[index] = StepperArrayEnum.EXPANDED
        }

        setSectionArray(updatedArray)
    }

    return (
        <>
            <div
                className={classnames({
                    'idsk-stepper__section': true,
                    'idsk-stepper__section--last-item': section.last,
                    'idsk-stepper__section--expanded': currentSection === StepperArrayEnum.EXPANDED,
                })}
            >
                <div className="idsk-stepper__section-header">
                    {section.stepLabel && (
                        <span
                            className={classnames({
                                'idsk-stepper__circle': true,
                                'idsk-stepper__circle--letter': section.stepLabel.variant === 'circle',
                                'idsk-stepper__circle--number': section.stepLabel.variant === 'no-outline',
                            })}
                        >
                            <span className="idsk-stepper__circle-inner">
                                <span className="idsk-stepper__circle-background">
                                    <span className="idsk-stepper__circle-step-label">{section.stepLabel.label}</span>
                                </span>
                            </span>
                        </span>
                    )}

                    <h4 className="idsk-stepper__section-heading">
                        <button
                            type="button"
                            id="expand-button"
                            aria-controls={uniqueId}
                            className="idsk-stepper__section-button"
                            aria-expanded={currentSection === StepperArrayEnum.EXPANDED}
                            onClick={handleOpen}
                        >
                            {section.title}
                            <span className="idsk-stepper__icon" aria-hidden={currentSection === StepperArrayEnum.CLOSED} />
                        </button>
                    </h4>
                </div>

                <div id={uniqueId} className="idsk-stepper__section-content" aria-labelledby="subsection">
                    {section.content}
                </div>
            </div>
        </>
    )
}
