import React, { ReactNode, RefObject, useEffect, useRef, useState, useId, cloneElement, ReactElement, AriaAttributes } from 'react'
import { Popup } from 'reactjs-popup'
import { PopupActions } from 'reactjs-popup/dist/types'
import classNames from 'classnames'

import styles from './buttonPopup.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

interface IButtonPopupProps {
    popupPosition?: 'left' | 'right'
    buttonLabel?: string
    popupContent: (closePopup: () => void) => ReactNode
    buttonClassName?: string
    contentClassNameReplacement?: string
    disabled?: boolean
    disabledTooltip?: ReactNode
    customTrigger?: ({ isExpanded }: { isExpanded: boolean }) => ReactElement
    triggerAria?: AriaAttributes
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
    contentClassNameReplacement,
    customTrigger,
    triggerAria,
}) => {
    const popupRef = useRef<PopupActions>(null)
    const contentRef = useRef(null)
    const triggerId = useId()
    const contentId = useId()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const label = (
        <div className={styles.buttonLabel}>
            {buttonLabel}
            <img src={ArrowDownIcon} alt="" className={styles.downArrow} />
        </div>
    )

    useTabbing(contentRef, isExpanded)

    const trigger = customTrigger ? (
        cloneElement(customTrigger({ isExpanded }), {
            id: triggerId,
            'aria-expanded': isExpanded,
            'aria-controls': contentId,
        })
    ) : (
        <Button
            id={triggerId}
            label={label}
            variant="secondary"
            className={classNames(buttonClassName, styles.button)}
            aria-expanded={isExpanded}
            aria-haspopup
            aria-controls={contentId}
            {...triggerAria}
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
            ref={popupRef}
            offsetY={2} //button box shadow
            onOpen={() => {
                setIsExpanded(true)
            }}
            keepTooltipInside
            onClose={() => {
                setIsExpanded(false)
                document.getElementById(triggerId)?.focus()
            }}
        >
            <div ref={contentRef} id={contentId} className={contentClassNameReplacement ?? styles.whiteBackground}>
                {popupContent(() => popupRef.current?.close())}
            </div>
        </Popup>
    )
}
