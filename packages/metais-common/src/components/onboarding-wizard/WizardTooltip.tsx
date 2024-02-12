import { TextHeading, Button, ButtonGroupRow } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { TooltipRenderProps } from 'react-joyride'
import { useTranslation } from 'react-i18next'

import styles from './wizardTooltip.module.scss'

import { CloseIcon } from '@isdd/metais-common/assets/images'

export const WizardTooltip: React.FC<TooltipRenderProps> = ({
    backProps,
    index,
    isLastStep,
    primaryProps,
    step,
    tooltipProps,
    size,
    closeProps,
}: TooltipRenderProps) => {
    const { t } = useTranslation()

    return (
        <div {...tooltipProps} className={styles.tooltipWrapper}>
            <div className={styles.tooltipHeader}>
                <TextHeading size="L">
                    {index + 1}/{size} {step.title}
                </TextHeading>
                <img src={CloseIcon} {...closeProps} className={styles.pointer} />
            </div>
            <div>{step.content}</div>
            <ButtonGroupRow className="">
                <Button disabled={index === 0} {...backProps} label={t('wizard.actions.back')} variant="secondary" />
                {!isLastStep ? (
                    <Button disabled={isLastStep} {...primaryProps} label={t('wizard.actions.next')} />
                ) : (
                    <Button {...closeProps} label={t('wizard.actions.close')} />
                )}
            </ButtonGroupRow>
        </div>
    )
}
