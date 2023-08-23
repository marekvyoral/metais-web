import classNames from 'classnames'
import React, { cloneElement, useState } from 'react'
import { ITooltip as IReactTooltip, Tooltip as ReactTooltip } from 'react-tooltip'
import { v4 as uuidV4 } from 'uuid'

import styles from './tooltip.module.scss'

import { InfoIcon, NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import './reactTooltip.scss'

interface ITooltip extends IReactTooltip {
    descriptionElement?: React.ReactNode
    id?: string
    children?: React.ReactElement
    className?: string
}

export const Tooltip: React.FC<ITooltip> = ({ descriptionElement, id, children, className, ...props }) => {
    const [isOpen, setIsOpen] = useState(false)
    const tooltipId = id ?? `tooltip_${uuidV4()}`
    return (
        <>
            <ReactTooltip
                anchorSelect={`#anchor-element-${tooltipId}`}
                variant="light"
                className={classNames(className, styles.tooltip)}
                classNameArrow={styles.tooltipArrow}
                isOpen={isOpen}
                setIsOpen={(value) => setIsOpen(value)}
                {...props}
            >
                {typeof descriptionElement === 'string' ? (
                    <TextBody size="S" className={styles.tooltipBody}>
                        {descriptionElement}
                    </TextBody>
                ) : (
                    descriptionElement
                )}
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
            {children ? cloneElement(children, { id: `anchor-element-${tooltipId}` }) : <img src={InfoIcon} id={`anchor-element-${tooltipId}`} />}
        </>
    )
}
