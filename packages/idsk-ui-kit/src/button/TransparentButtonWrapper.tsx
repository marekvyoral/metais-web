import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './styles.module.scss'

interface IButton extends PropsWithChildren {
    onClick: () => void
}

export const TransparentButtonWrapper = forwardRef<HTMLButtonElement, IButton>(({ children, onClick }, props) => {
    return (
        <button {...props} onClick={onClick} className={styles.transparentButton}>
            {children}
        </button>
    )
})
