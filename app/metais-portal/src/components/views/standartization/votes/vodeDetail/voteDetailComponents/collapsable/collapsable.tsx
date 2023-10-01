import classNames from 'classnames'
import React, { useState } from 'react'

import styles from './collapsable.module.scss'

type CollapsableProps = {
    openAtBeginning?: boolean
    heading?: React.ReactNode
    collapseSign?: React.ReactNode
    collapseText?: string
    expandSign?: React.ReactNode
    expandText?: string
    children?: React.ReactNode
}

export const Collapsable = ({ collapseSign, collapseText, expandSign, expandText, heading, children, openAtBeginning }: CollapsableProps) => {
    const [isOpen, setOpen] = useState(!!openAtBeginning)
    const handleOpenCloseForm = () => {
        setOpen((current) => !current)
    }

    return (
        <div className={classNames(styles.wrapper)}>
            <div className={classNames({ 'idsk-table-filter--expanded': isOpen })}>
                <div className={styles.headingWrapper}>
                    <div className={classNames(styles.heading)}>{heading}</div>
                    {
                        <div className={styles.expandButton}>
                            <button
                                onClick={handleOpenCloseForm}
                                className={styles.borderless}
                                aria-label={isOpen ? collapseText : expandText}
                                type="button"
                            >
                                {isOpen ? collapseSign ?? collapseText : expandSign ?? expandText}
                            </button>
                        </div>
                    }
                </div>
                <div aria-hidden={!isOpen} className={classNames(styles.animate, isOpen && styles.grow)}>
                    {children}
                </div>
            </div>
        </div>
    )
}
