import { TextHeading, Button, ButtonGroupRow, TransparentButtonWrapper } from '@isdd/idsk-ui-kit/index'
import React, { useId } from 'react'
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
    const headerId = useId()
    const contentId = useId()

    return (
        <div {...tooltipProps} className={styles.tooltipWrapper} aria-labelledby={headerId} aria-describedby={contentId}>
            <div className={styles.tooltipHeader} id={headerId}>
                <TextHeading size="L">
                    <span className="govuk-visually-hidden">{t('wizard.ariaDescription')}</span>
                    {index + 1}/{size} {step.title}
                </TextHeading>
                <TransparentButtonWrapper {...closeProps} onClick={closeProps.onClick as () => void}>
                    <img src={CloseIcon} alt="" />
                </TransparentButtonWrapper>
            </div>
            <div id={contentId}>{step.content}</div>
            <ButtonGroupRow className="">
                <Button disabled={index === 0} {...backProps} label={backProps.title} variant="secondary" tabIndex={1} />
                {!isLastStep ? (
                    <Button disabled={isLastStep} {...primaryProps} label={primaryProps.title} />
                ) : (
                    <Button {...closeProps} label={closeProps.title} />
                )}
            </ButtonGroupRow>
        </div>
    )
}
