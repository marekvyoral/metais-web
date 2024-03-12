import classnames from 'classnames'
import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { StepperArrayEnum } from './Stepper'
import styles from './stepper.module.scss'

import { AlertTriangleIcon, InfoIcon } from '@isdd/idsk-ui-kit/assets/images'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block-list/ErrorBlockList'
import { AriaSectionErrorList } from '@isdd/idsk-ui-kit/aria-section-error-list/AriaSectionErrorList'

export interface IStepLabel {
    label: string
    variant: 'circle' | 'no-outline'
}

export interface ISection {
    id: string
    title: string
    last?: boolean
    isTitle?: boolean
    stepLabel?: IStepLabel
    content?: React.ReactNode
    error?: boolean
    errorMessages?: ErrorBlock[]
    change?: boolean
    isOpen?: boolean
    hide?: boolean
}

interface IStepperSection {
    sectionArray: number[]
    setSectionArray: React.Dispatch<React.SetStateAction<StepperArrayEnum[]>>
    section: ISection
    index: number
    textHeadingSize?: 'S' | 'M' | 'L' | 'XL'
}

export const StepperSection: React.FC<IStepperSection> = ({ section, sectionArray, index, setSectionArray, textHeadingSize }) => {
    const { t } = useTranslation()
    const currentSection = sectionArray.at(index)
    const uniqueId = `expand-section${useId()}`
    const errorId = `error-${useId()}`

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
            {!section.hide && (
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
                            <TextHeading className={classnames('idsk-stepper__section-heading', styles.heading)} size={textHeadingSize ?? 'L'}>
                                <button
                                    type="button"
                                    id="expand-button"
                                    aria-controls={uniqueId}
                                    className="idsk-stepper__section-button"
                                    aria-expanded={currentSection === StepperArrayEnum.EXPANDED}
                                    onClick={handleOpen}
                                    aria-describedby={errorId}
                                >
                                    {section.title}
                                    <span className="idsk-stepper__icon" aria-hidden />
                                </button>
                            </TextHeading>
                            <div className={styles.icons}>
                                <span id={errorId}>{section.error && <AriaSectionErrorList section={section} />}</span>
                                {section.error && <img src={AlertTriangleIcon} alt={t('stepper.sectionError')} />}
                                {section.change && <img src={InfoIcon} alt={t('stepper.sectionChange')} />}
                            </div>
                        </div>
                    </div>

                    <div id={uniqueId} className="idsk-stepper__section-content" aria-labelledby="subsection">
                        {section.content}
                    </div>
                </div>
            )}
        </>
    )
}
