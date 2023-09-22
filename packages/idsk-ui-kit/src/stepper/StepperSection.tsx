import classnames from 'classnames'
import React, { useId } from 'react'

import { StepperArrayEnum } from './Stepper'
import styles from './stepper.module.scss'

import { AlertTriangleIcon, InfoIcon } from '@isdd/idsk-ui-kit/assets/images'
export interface IStepLabel {
    label: string
    variant: 'circle' | 'no-outline'
}

export interface ISection {
    title: string
    last?: boolean
    isTitle?: boolean
    stepLabel?: IStepLabel
    content?: React.ReactNode
    error?: boolean
    change?: boolean
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
                            className={classnames(styles.circleZIndex, {
                                'idsk-stepper__circle': true,
                                'idsk-stepper__circle--letter': section.stepLabel.variant === 'no-outline',
                                'idsk-stepper__circle--number': section.stepLabel.variant === 'circle',
                            })}
                        >
                            <span className="idsk-stepper__circle-inner">
                                <span className="idsk-stepper__circle-background">
                                    <span className="idsk-stepper__circle-step-label">{section.stepLabel.label}</span>
                                </span>
                            </span>
                        </span>
                    )}
                    <div className={styles.headerDiv}>
                        <h2 className="idsk-stepper__section-heading">
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
                        </h2>
                        {section.error && <img src={AlertTriangleIcon} />}
                        {section.change && <img src={InfoIcon} />}
                    </div>
                </div>

                <div id={uniqueId} className="idsk-stepper__section-content" aria-labelledby="subsection">
                    {section.content}
                </div>
            </div>
        </>
    )
}
