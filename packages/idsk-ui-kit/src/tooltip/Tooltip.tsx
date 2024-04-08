import React, { useEffect, useId, useRef, useState } from 'react'
import { Popup } from 'reactjs-popup'
import { EventType, PopupActions, PopupPosition } from 'reactjs-popup/dist/types'
import { useTranslation } from 'react-i18next'

import styles from './Tooltip.module.scss'

import { InfoIcon, NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'
import './Tooltip.scss'
interface ITooltip {
    id?: string
    descriptionElement: React.ReactNode
    triggerElement?: React.ReactNode
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

export const Tooltip: React.FC<ITooltip> = ({ descriptionElement, triggerElement, tooltipContent, closeButton = false, tabIndex, id, ...props }) => {
    const popupRef = useRef<PopupActions>(null)
    const { t } = useTranslation()
    const uId = useId()
    const descriptionId = id ?? uId
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        setIsOpen(props.defaultOpen ?? false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setIsOpen(props.open ?? false)
    }, [props.open])

    return (
        <Popup
            mouseLeaveDelay={200}
            ref={popupRef}
            arrow={props.position != 'center center'}
            className="tooltip"
            on={['click']}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            keepTooltipInside
            {...props}
            trigger={() => (
                <div>
                    {tooltipContent
                        ? tooltipContent(
                              () => popupRef.current?.open(),
                              () => popupRef.current?.close(),
                          )
                        : triggerElement ?? (
                              <>
                                  <button
                                      tabIndex={tabIndex}
                                      className={styles.transparentButton}
                                      type="button"
                                      aria-label={props.altText}
                                      aria-describedby={descriptionId}
                                  >
                                      <img alt="" src={InfoIcon} />
                                  </button>
                              </>
                          )}
                    <div id={descriptionId} className="govuk-visually-hidden" aria-live="polite">
                        {isOpen ? descriptionElement : ''}
                    </div>
                </div>
            )}
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
                        aria-label={t('close')}
                    >
                        <img src={NavigationCloseIcon} alt="" />
                    </button>
                )}
            </div>
        </Popup>
    )
}
