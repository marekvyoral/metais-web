import classNames from 'classnames'
import React from 'react'

import { ISection, StepperSection } from './StepperSection'
import { StepperSubtitle } from './StepperSubtitle'
import { StepperSectionTitle } from './StepperTitle'
import styles from './stepper.module.scss'

export enum StepperArrayEnum {
    CLOSED,
    EXPANDED,
    IGNORE,
}

interface IStepper {
    description?: string
    subtitleTitle: string
    stepperList: ISection[]
    sectionsHeadingSize?: 'S' | 'M' | 'L' | 'XL'
    handleSectionOpen: (id: string) => void
    openOrCloseAllSections: () => void
}

export const Stepper: React.FC<IStepper> = ({
    description,
    stepperList,
    sectionsHeadingSize,
    handleSectionOpen,
    subtitleTitle,
    openOrCloseAllSections,
}) => {
    return (
        <>
            {description && <p className="idsk-stepper__caption govuk-caption-m">{description}</p>}
            <div className={classNames('idsk-stepper', styles.marginBottom)} data-module="idsk-stepper" data-attribute="value">
                <StepperSubtitle title={subtitleTitle} stepperList={stepperList} openOrCloseAllSections={openOrCloseAllSections} />
                {stepperList.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.isTitle ? (
                            <StepperSectionTitle title={item.title} />
                        ) : (
                            <StepperSection
                                textHeadingSize={sectionsHeadingSize}
                                index={index}
                                section={item}
                                handleSectionOpen={handleSectionOpen}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}
