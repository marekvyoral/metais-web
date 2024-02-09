import React, { ReactNode, useRef, useState } from 'react'
import { Popup } from 'reactjs-popup'
import { PopupActions } from 'reactjs-popup/dist/types'

import styles from './buttonPopup.module.scss'

import { ArrowDownIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

interface IButtonPopupProps {
    popupPosition?: 'left' | 'right'
    buttonLabel: string
    popupContent: (closePopup: () => void) => ReactNode
    buttonClassName?: string
    disabled?: boolean
}

export const ButtonPopup: React.FC<IButtonPopupProps> = ({ buttonLabel, popupContent, disabled, popupPosition = 'left', buttonClassName }) => {
    const popupRef = useRef<PopupActions>(null)
    const label = (
        <div className={styles.buttonLabel}>
            {buttonLabel} <img src={ArrowDownIcon} alt="" className={styles.downArrow} />
        </div>
    )
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Popup
            trigger={<Button label={label} variant="secondary" className={buttonClassName} aria-expanded={isExpanded} />}
            position={`bottom ${popupPosition}`}
            arrow={false}
            disabled={disabled}
            keepTooltipInside
            ref={popupRef}
            offsetY={2} //button box shadow
            onOpen={() => setIsExpanded(true)}
            onClose={() => setIsExpanded(false)}
        >
            <div className={styles.whiteBackground}>{popupContent(() => popupRef.current?.close())}</div>
        </Popup>
    )
}
