import React, { useState } from 'react'
import classNames from 'classnames'

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
}

export const Stepper: React.FC<IStepper> = ({ description, stepperList, subtitleTitle }) => {
    const defaultArray = Array<StepperArrayEnum>(stepperList.length).fill(StepperArrayEnum.CLOSED)
    if (stepperList) {
        stepperList.map((item, index) => {
            if (item.isOpen) defaultArray[index] = StepperArrayEnum.EXPANDED
        })
    }

    const [sectionArray, setSectionArray] = useState(defaultArray)

    return (
        <>
            {description && <p className="idsk-stepper__caption govuk-caption-m">{description}</p>}
            <div className={classNames('idsk-stepper', styles.marginBottom)} data-module="idsk-stepper" data-attribute="value">
                <StepperSubtitle title={subtitleTitle} setSectionArray={setSectionArray} sectionArray={sectionArray} />
                {stepperList.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.isTitle ? (
                            <StepperSectionTitle index={index} title={item.title} sectionArray={sectionArray} setSectionArray={setSectionArray} />
                        ) : (
                            <StepperSection index={index} section={item} sectionArray={sectionArray} setSectionArray={setSectionArray} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}
