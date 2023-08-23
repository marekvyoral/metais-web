import classNames from 'classnames'
import React, { useState } from 'react'
import { ITooltip as IReactTooltip, Tooltip as ReactTooltip } from 'react-tooltip'
import { v4 as uuidV4 } from 'uuid'

import styles from './Tooltip.module.scss'

import { InfoIcon, NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

interface ITooltip extends IReactTooltip {
    description?: string
    id?: string
    children?: React.ReactElement
    className?: string
}

export const Tooltip: React.FC<ITooltip> = ({ description, id, children, className, ...props }) => {
    const [isOpen, setIsOpen] = useState(false)
    const tooltipId = id ?? `tooltip_${uuidV4()}`
    return (
        <>
            <ReactTooltip
                id={tooltipId}
                variant="light"
                className={classNames(className, styles.tooltip)}
                classNameArrow={styles.tooltipArrow}
                isOpen={isOpen}
                setIsOpen={(value) => setIsOpen(value)}
                {...props}
            >
                <TextBody size="S" className={styles.tooltipBody}>
                    {description}
                </TextBody>
                {props.clickable && (
                    <button
                        className={styles.closeButton}
                        data-module="idsk-button"
                        type="button"
                        role="button"
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        <img src={NavigationCloseIcon} alt="navigation-close" />
                    </button>
                )}
            </ReactTooltip>
            {children ? (
                <span className={styles.displayInlineBlock} data-tooltip-id={tooltipId}>
                    {children}
                </span>
            ) : (
                <img src={InfoIcon} data-tooltip-id={tooltipId} />
            )}
        </>
    )
}
