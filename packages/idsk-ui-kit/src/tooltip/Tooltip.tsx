import React, { cloneElement, useState } from 'react'
import { ITooltip as IReactTooltip, Tooltip as ReactTooltip } from 'react-tooltip'
import { v4 as uuidV4 } from 'uuid'

import styles from './Tooltip.module.scss'

import { InfoIcon, NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

interface ITooltip extends IReactTooltip {
    description?: string
    id?: string
    children?: React.ReactElement
}

export const Tooltip: React.FC<ITooltip> = ({ description, id = `input_${uuidV4()}`, children, ...props }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <ReactTooltip
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
            </ReactTooltip>
            {children ? cloneElement(children, { className: `anchor-element-${id}` }) : <img src={InfoIcon} className={`anchor-element-${id}`} />}
        </>
    )
}
