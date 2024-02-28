import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './styles.module.scss'

interface IButton extends PropsWithChildren {
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
}

export const TransparentButtonWrapper = forwardRef<HTMLButtonElement, IButton>(({ children, onClick, type }, props) => {
    return (
        <button {...props} onClick={onClick} className={styles.transparentButton} type={type}>
            {children}
        </button>
    )
})
