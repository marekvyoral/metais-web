import React, { cloneElement, useState } from 'react'
import { Tooltip, ITooltip } from 'react-tooltip'

import { InfoIcon, NavigationCloseIcon } from '../assets/images'
import { TextBody } from '../typography/TextBody'

import styles from './CustomTooltip.module.scss'

interface IInfoInputIcon extends ITooltip {
    description?: string
    id: string
    close?: () => void
    children: React.ReactElement
}

export const CustomTooltip: React.FC<IInfoInputIcon> = ({ description, id, children, close, ...props }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <Tooltip
                anchorSelect={`.anchor-element-${id}`}
                variant="light"
                className={styles.tooltip}
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
            </Tooltip>
            {children ? cloneElement(children, { className: `anchor-element-${id}` }) : <img src={InfoIcon} className={`anchor-element-${id}`} />}
        </>
    )
}
