import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './styles.module.scss'

interface IButton extends PropsWithChildren {
    onClick: () => void
    type?: 'button' | 'submit' | 'reset'
}

export const TransparentButtonWrapper = forwardRef<HTMLButtonElement, IButton>(({ children, onClick, type, ...rest }, ref) => {
    return (
        <button {...ref} {...rest} onClick={onClick} className={styles.transparentButton} type={type}>
            {children}
        </button>
    )
})
