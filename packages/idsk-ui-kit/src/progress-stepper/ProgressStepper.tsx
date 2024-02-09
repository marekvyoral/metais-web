import classNames from 'classnames'
import React, { useState } from 'react'
import { useWindowWidthBreakpoints } from '@isdd/metais-common/src/hooks/window-size/useWindowWidthBreakpoints'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import {
    ArrowDownIcon,
    CurrentStepIcon,
    FinishedStepIcon,
    FutureStepIcon,
    LoadingIndicator,
    TextBody,
    TransparentButtonWrapper,
} from '@isdd/idsk-ui-kit/'

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
    isExpanded?: boolean
    onExpand?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IProgressStepper {
    steps: IStep[]
    currentStep: number
    isLoading: boolean
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
    const { t } = useTranslation()
    return (
        <div key={keyNumber} className={styles.step}>
            <div className={styles.stepIndicator}>
                <div className={classNames(styles.line, styles[lineColor('before', state, firstItem, lastItem)])} />
                <img
                    src={state == PROGRESS_STATE.CURRENT ? CurrentStepIcon : state == PROGRESS_STATE.FINISHED ? FinishedStepIcon : FutureStepIcon}
                    height={16}
                    alt={
                        state == PROGRESS_STATE.CURRENT
                            ? t('progressStepper.state.current')
                            : state == PROGRESS_STATE.FINISHED
                            ? t('progressStepper.state.finished')
                            : t('progressStepper.state.future')
                    }
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

export const MobileStep: React.FC<IStep> = ({ keyNumber, name, date, description, state, firstItem, lastItem, isRed, isExpanded, onExpand }) => {
    const { t } = useTranslation()
    return (
        <div key={keyNumber} className={styles.mobileStep}>
            <div className={styles.mobileStepIndicator}>
                <div className={classNames(styles.mobileLine, styles[lineColor('before', state, firstItem, lastItem)])} />
                <img
                    src={state == PROGRESS_STATE.CURRENT ? CurrentStepIcon : state == PROGRESS_STATE.FINISHED ? FinishedStepIcon : FutureStepIcon}
                    height={16}
                    alt={
                        state == PROGRESS_STATE.CURRENT
                            ? t('progressStepper.state.current')
                            : state == PROGRESS_STATE.FINISHED
                            ? t('progressStepper.state.finished')
                            : t('progressStepper.state.future')
                    }
                />
                <div className={classNames(styles.mobileLine, styles[lineColor('after', state, firstItem, lastItem)])} />
            </div>
            <div className={styles.mobileColumnWrapper}>
                <div className={styles.mobileTextDate}>
                    <TextBody
                        className={classNames([styles.mobileTextWrapper, styles.noWrap], {
                            [styles.greenText]: state == PROGRESS_STATE.FINISHED,
                            [styles.greyText]: state == PROGRESS_STATE.FUTURE,
                            [styles.redText]: isRed,
                        })}
                    >
                        {keyNumber + '. ' + name}
                    </TextBody>

                    <TextBody size="S" className={styles.mobileDateWrapper}>
                        {date}
                    </TextBody>
                </div>
                <div className={styles.descriptionWrapper}>
                    <TextBody size="S" className={styles.mobileTextWrapper}>
                        {description}
                    </TextBody>
                    {((state == PROGRESS_STATE.CURRENT && !isExpanded) || (lastItem && isExpanded)) && (
                        <TransparentButtonWrapper onClick={() => onExpand && onExpand(!isExpanded)}>
                            <img
                                height={10}
                                className={classNames(styles.imageMargin, { [styles.rotate180]: isExpanded })}
                                src={ArrowDownIcon}
                                alt={isExpanded ? t('progressStepper.collapse') : t('progressStepper.expand')}
                            />
                        </TransparentButtonWrapper>
                    )}
                </div>
            </div>
        </div>
    )
}

const resolveState = (index: number, currentStep: number) =>
    index == currentStep ? PROGRESS_STATE.CURRENT : index < currentStep ? PROGRESS_STATE.FINISHED : PROGRESS_STATE.FUTURE

export const ProgressStepper: React.FC<IProgressStepper> = ({ steps, currentStep, isLoading }) => {
    const windowWidthBreakpoints = useWindowWidthBreakpoints()
    const [isExpanded, setExpanded] = useState(false)
    return windowWidthBreakpoints?.tablet || !windowWidthBreakpoints ? (
        <div className={classNames(styles.mainWrapper, { [styles.positionRelative]: isLoading })}>
            {isLoading ? (
                <div className={styles.paddingLoading}>
                    <LoadingIndicator transparentMask />
                </div>
            ) : (
                <div className={styles.stepsWrapper}>
                    {steps.map((step, index) => {
                        return (
                            <Step
                                key={index}
                                keyNumber={index + 1}
                                {...step}
                                state={resolveState(index, currentStep)}
                                firstItem={index == 0}
                                lastItem={index == steps.length - 1}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    ) : (
        <div className={styles.mobileMainWrapper}>
            {isLoading ? (
                <div className={styles.paddingLoading}>
                    <LoadingIndicator transparentMask />
                </div>
            ) : (
                <div className={styles.mobileStepsWrapper}>
                    {steps.map((step, index) => {
                        return (
                            (index == currentStep || isExpanded) && (
                                <MobileStep
                                    isExpanded={isExpanded}
                                    onExpand={setExpanded}
                                    key={index}
                                    keyNumber={index + 1}
                                    {...step}
                                    state={resolveState(index, currentStep)}
                                    firstItem={index == 0}
                                    lastItem={index == steps.length - 1}
                                />
                            )
                        )
                    })}
                </div>
            )}
        </div>
    )
}
