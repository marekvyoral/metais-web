import React, { ReactNode, useRef } from 'react'
import { Popup } from 'reactjs-popup'
import { PopupActions } from 'reactjs-popup/dist/types'

import styles from './buttonPopup.module.scss'

import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit/assets/images'

interface IButtonPopupProps {
    popupPosition?: 'left' | 'right'
    buttonLabel: string
    popupContent: (closePopup: () => void) => ReactNode
    buttonClassname?: string
}

export const ButtonPopup: React.FC<IButtonPopupProps> = ({ buttonLabel, popupContent, popupPosition = 'left', buttonClassname }) => {
    const popupRef = useRef<PopupActions>(null)
    const label = (
        <div className={styles.buttonLabel}>
            {buttonLabel} <img src={ArrowDownIcon} alt="arrow-down" className={styles.downArrow} />
        </div>
    )
    return (
        <Popup
            trigger={<Button label={label} variant="secondary" className={buttonClassname} />}
            position={`bottom ${popupPosition}`}
            arrow={false}
            keepTooltipInside
            ref={popupRef}
            offsetY={2} //button box shadow
        >
            <div className={styles.whiteBackground}>{popupContent(() => popupRef.current?.close())}</div>
        </Popup>
    )
}
