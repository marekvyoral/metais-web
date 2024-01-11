import React, { useRef } from 'react'
import { Popup } from 'reactjs-popup'
import { EventType, PopupActions, PopupPosition } from 'reactjs-popup/dist/types'

import styles from './Tooltip.module.scss'

import { InfoIcon, NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'
import './Tooltip.scss'
interface ITooltip {
    descriptionElement: React.ReactNode
    tooltipContent?: (open: () => void, close: () => void) => JSX.Element
    closeButton?: boolean
    open?: boolean
    disabled?: boolean
    defaultOpen?: boolean
    on?: EventType | EventType[]
    position?: PopupPosition | PopupPosition[]
    offsetX?: number
    offsetY?: number
    arrow?: boolean
    lockScroll?: boolean
    repositionOnResize?: boolean
    mouseEnterDelay?: number
    mouseLeaveDelay?: number
    className?: string
    altText?: string
}

export const Tooltip: React.FC<ITooltip> = ({ descriptionElement, tooltipContent, closeButton = false, ...props }) => {
    const popupRef = useRef<PopupActions>(null)
    return (
        <>
            <Popup
                ref={popupRef}
                arrow={props.position != 'center center'}
                closeOnEscape
                keepTooltipInside
                className="tooltip"
                on={['click', 'hover', 'focus']}
                {...props}
                trigger={() =>
                    tooltipContent ? (
                        tooltipContent(
                            () => popupRef.current?.open(),
                            () => popupRef.current?.close(),
                        )
                    ) : (
                        <img alt={props.altText} src={InfoIcon} onMouseOver={popupRef.current?.open} onMouseOut={popupRef.current?.close} />
                    )
                }
            >
                <div className={styles.displayFlexCenter}>
                    {descriptionElement}
                    {closeButton && (
                        <button
                            className={styles.closeButton}
                            data-module="idsk-button"
                            type="button"
                            role="button"
                            onClick={() => {
                                popupRef.current?.close()
                            }}
                        >
                            <img src={NavigationCloseIcon} alt="navigation-close" />
                        </button>
                    )}
                </div>
            </Popup>
        </>
    )
}
