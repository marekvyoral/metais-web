import React, { useRef } from 'react'
import { Popup } from 'reactjs-popup'
import { EventType, PopupActions, PopupPosition } from 'reactjs-popup/dist/types'
import { v4 as uuidV4 } from 'uuid'
import { useTranslation } from 'react-i18next'

import styles from './Tooltip.module.scss'

import { InfoIcon, NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'
import './Tooltip.scss'
interface ITooltip {
    id?: string
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
    tabIndex?: number
}

export const Tooltip: React.FC<ITooltip> = ({ descriptionElement, tooltipContent, closeButton = false, tabIndex, id, ...props }) => {
    const popupRef = useRef<PopupActions>(null)
    const { t } = useTranslation()
    const descriptionId = id ? `${id}-description` : `${uuidV4()}-description`

    return (
        <Popup
            mouseLeaveDelay={200}
            ref={popupRef}
            disabled={!descriptionElement}
            arrow={props.position != 'center center'}
            closeOnEscape
            keepTooltipInside
            className="tooltip"
            on={['click', 'hover', 'focus']}
            {...props}
            trigger={() =>
                tooltipContent ? (
                    <div>
                        {tooltipContent(
                            () => popupRef.current?.open(),
                            () => popupRef.current?.close(),
                        )}
                    </div>
                ) : (
                    <div onMouseOver={popupRef.current?.open} onMouseOut={popupRef.current?.close}>
                        <button
                            tabIndex={tabIndex}
                            className={styles.transparentButton}
                            type="button"
                            aria-label={props.altText}
                            aria-describedby={descriptionId}
                        >
                            <img alt="" src={InfoIcon} />
                        </button>
                        <div id={descriptionId} className="govuk-visually-hidden">
                            {descriptionElement}
                        </div>
                    </div>
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
                        <img src={NavigationCloseIcon} alt={t('close')} />
                    </button>
                )}
            </div>
        </Popup>
    )
}
