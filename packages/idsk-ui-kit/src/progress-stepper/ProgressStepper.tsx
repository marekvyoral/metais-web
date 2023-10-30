import classNames from 'classnames'
import React from 'react'

import styles from './styles.module.scss'

import { CurrentStepIcon, FinishedStepIcon, FutureStepIcon, TextBody } from '@isdd/idsk-ui-kit/'

export enum PROGRESS_STATE {
    FINISHED = 'finished',
    CURRENT = 'current',
    FUTURE = 'future',
}

export interface IStep {
    keyNumber?: number
    name: string
    date?: string
    description?: string
    state?: PROGRESS_STATE
    firstItem?: boolean
    lastItem?: boolean
    isRed?: boolean
}

export interface IProgressStepper {
    steps: IStep[]
    currentStep: number
}

const lineColor = (position: 'before' | 'after', state?: PROGRESS_STATE, firstItem?: boolean, lastItem?: boolean): string => {
    if (firstItem && position == 'before') return 'transparent'
    if (lastItem && position == 'after') return 'transparent'
    switch (state) {
        case PROGRESS_STATE.FINISHED:
            return 'green'
        case PROGRESS_STATE.CURRENT:
            return position == 'before' ? 'black' : 'grey'
        case PROGRESS_STATE.FUTURE:
            return 'grey'
    }
    return 'grey'
}

export const Step: React.FC<IStep> = ({ keyNumber, name, date, description, state, firstItem, lastItem, isRed }) => {
    return (
        <div key={keyNumber} className={styles.step}>
            <div className={styles.stepIndicator}>
                <div className={classNames(styles.line, styles[lineColor('before', state, firstItem, lastItem)])} />
                <img
                    src={state == PROGRESS_STATE.CURRENT ? CurrentStepIcon : state == PROGRESS_STATE.FINISHED ? FinishedStepIcon : FutureStepIcon}
                    height={16}
                />
                <div className={classNames(styles.line, styles[lineColor('after', state, firstItem, lastItem)])} />
            </div>
            <TextBody
                className={classNames([styles.textWrapper, styles.noWrap], {
                    [styles.greenText]: state == PROGRESS_STATE.FINISHED,
                    [styles.greyText]: state == PROGRESS_STATE.FUTURE,
                    [styles.redText]: isRed,
                })}
            >
                {keyNumber + '. ' + name}
            </TextBody>
            <TextBody size="S" className={styles.textWrapper}>
                {date}
            </TextBody>
            <TextBody size="S" className={styles.textWrapper}>
                {description}
            </TextBody>
        </div>
    )
}

export const ProgressStepper: React.FC<IProgressStepper> = ({ steps, currentStep }) => {
    return (
        <div className={styles.mainWrapper}>
            <div className={styles.stepsWrapper}>
                {steps.map((step, index) => {
                    return (
                        <Step
                            key={index}
                            keyNumber={index + 1}
                            {...step}
                            state={
                                index == currentStep ? PROGRESS_STATE.CURRENT : index < currentStep ? PROGRESS_STATE.FINISHED : PROGRESS_STATE.FUTURE
                            }
                            firstItem={index == 0}
                            lastItem={index == steps.length - 1}
                        />
                    )
                })}
            </div>
        </div>
    )
}
