import React, { cloneElement } from 'react'
import { ITooltip, Tooltip } from 'react-tooltip'

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
    return (
        <>
            <Tooltip
                anchorSelect={`.anchor-element-${id}`}
                variant="light"
                className={styles.tooltip}
                classNameArrow={styles.tooltipArrow}
                {...props}
            >
                <TextBody size="S" className={styles.tooltipBody}>
                    {description}
                </TextBody>
                <button className={styles.closeButton} onClick={close}>
                    <img src={NavigationCloseIcon} alt="navigation-close" />
                </button>
            </Tooltip>
            {children ? cloneElement(children, { className: `anchor-element-${id}` }) : <img src={InfoIcon} className={`anchor-element-${id}`} />}
        </>
    )
}
