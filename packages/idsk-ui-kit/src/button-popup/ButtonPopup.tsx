import React, { ReactNode, RefObject, useEffect, useRef, useState, useId } from 'react'
import { Popup } from 'reactjs-popup'
import { PopupActions } from 'reactjs-popup/dist/types'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'

import styles from './buttonPopup.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

interface IButtonPopupProps {
    popupPosition?: 'left' | 'right'
    buttonLabel: string
    popupContent: (closePopup: () => void) => ReactNode
    buttonClassName?: string
    disabled?: boolean
    disabledTooltip?: ReactNode
}

export const useTabbing = (contentRef: RefObject<HTMLElement>, active = true) => {
    // copied and modified from 'reactjs-popup/src/hooks'

    useEffect(() => {
        if (!active) return
        const listener = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                const els = contentRef?.current?.querySelectorAll(
                    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
                )

                const focusableEls = Array.prototype.slice.call(els)
                if (focusableEls.length === 1) {
                    event.preventDefault()
                    return
                }

                const firstFocusableEl = focusableEls[0]
                const lastFocusableEl = focusableEls[focusableEls.length - 1]

                if (event.shiftKey && document.activeElement === firstFocusableEl) {
                    event.preventDefault()
                    lastFocusableEl.focus()
                } else if (!event.shiftKey && document.activeElement === lastFocusableEl) {
                    // condition modified from old source code, `!event.shiftKey` added
                    event.preventDefault()
                    firstFocusableEl.focus()
                }
            }
        }

        document.addEventListener('keydown', listener)

        return () => {
            if (!active) return
            document.removeEventListener('keydown', listener)
        }
    }, [contentRef, active])
}

export const ButtonPopup: React.FC<IButtonPopupProps> = ({
    buttonLabel,
    popupContent,
    disabled,
    disabledTooltip,
    popupPosition = 'left',
    buttonClassName,
}) => {
    const popupRef = useRef<PopupActions>(null)
    const labelId = `label_button_${uuidV4()}`
    const contentRef = useRef(null)
    const triggerId = useId()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const label = (
        <div className={styles.buttonLabel}>
            <span id={labelId}>{buttonLabel}</span>
            <img src={ArrowDownIcon} alt="" className={styles.downArrow} />
        </div>
    )

    useTabbing(contentRef, isExpanded)

    const trigger = (
        <Button
            id={triggerId}
            label={label}
            aria-labelledby={labelId}
            variant="secondary"
            className={classNames(buttonClassName, styles.button)}
            aria-expanded={isExpanded}
        />
    )

    if (disabled && disabledTooltip) {
        return (
            <Tooltip
                on={['click']}
                defaultOpen={false}
                descriptionElement={disabledTooltip}
                triggerElement={trigger}
                altText={`Tooltip ${buttonLabel}`}
            />
        )
    }

    return (
        <Popup
            trigger={trigger}
            position={`bottom ${popupPosition}`}
            arrow={false}
            disabled={disabled}
            keepTooltipInside
            repositionOnResize
            ref={popupRef}
            offsetY={2} //button box shadow
            onOpen={() => {
                setIsExpanded(true)
            }}
            onClose={() => {
                setIsExpanded(false)
                document.getElementById(triggerId)?.focus()
            }}
        >
            <div ref={contentRef}>
                <div className={styles.whiteBackground}>{popupContent(() => popupRef.current?.close())}</div>
            </div>
        </Popup>
    )
}
