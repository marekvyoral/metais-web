import React, { PropsWithChildren, ReactNode, forwardRef } from 'react'
import classNames from 'classnames'
import sanitizeHtml from 'sanitize-html'
import { useTranslation } from 'react-i18next'

import styles from './infoIcon.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface IInfoIconWithTextProps extends PropsWithChildren {
    tooltip?: string
    hideIcon?: boolean
    label?: ReactNode
}

export const InfoIconWithText = forwardRef<HTMLDivElement, IInfoIconWithTextProps>(({ children, tooltip, hideIcon = false, label }, ref) => {
    const { t } = useTranslation()

    return (
        <span className={classNames(styles.infoIconGroup)} ref={ref}>
            {!hideIcon && (
                <span className={classNames(styles.infoIcon)}>
                    <Tooltip
                        altText={label && typeof label === 'string' ? t('tooltip.iconAltText', { text: label }) : ''}
                        descriptionElement={<div className="tooltipWidth500" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tooltip ?? '') }} />}
                    />
                </span>
            )}
            <span className={classNames(styles.infoText)}>{children}</span>
        </span>
    )
})
