import React, { useState, useId, PropsWithChildren, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import styles from './accordion.module.scss'
import { AccordionSection } from './AccordionSection'

import { Button } from '@isdd/idsk-ui-kit/button/Button'

export type IAccordionSection = {
    title: string
    onLoadOpen?: boolean
    error?: boolean
    summary?: React.ReactNode
    content: React.ReactNode
}

interface IAccordionContainerProps extends PropsWithChildren {
    sections: IAccordionSection[]
    indexOfSectionToExpand?: number
    isSmall?: boolean
    shouldNotUnMountContent?: boolean
}

export const AccordionContainer: React.FC<IAccordionContainerProps> = ({ sections, indexOfSectionToExpand, isSmall, shouldNotUnMountContent }) => {
    const { t } = useTranslation()
    const id = useId()

    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(Array(sections.length).fill(false))

    useEffect(() => {
        const sectionsArray = Array(sections.length).fill(false)
        if (indexOfSectionToExpand || indexOfSectionToExpand === 0) {
            setExpandedSectionIndexes([...sectionsArray.slice(0, indexOfSectionToExpand), true, ...sectionsArray.slice(indexOfSectionToExpand + 1)])
        }
    }, [indexOfSectionToExpand, sections.length])

    const isAllExpanded = expandedSectionIndexes.every((x) => x) && expandedSectionIndexes.length > 0

    const toggleAllExpanded = () => {
        setExpandedSectionIndexes(Array(sections.length).fill(!isAllExpanded))
    }

    return (
        <div className={classNames('govuk-accordion', { [styles.noBorder]: isSmall, [styles.smallMarginBottom]: isSmall })}>
            {!isSmall && (
                <div className="govuk-accordion__controls">
                    <Button
                        variant="secondary"
                        aria-expanded={isAllExpanded}
                        label={isAllExpanded ? t('accordion.closeAll') : t('accordion.openAll')}
                        onClick={toggleAllExpanded}
                    />
                </div>
            )}
            {sections.map((section, index) => (
                <AccordionSection
                    key={index}
                    section={section}
                    index={index}
                    setExpandedSectionIndexes={setExpandedSectionIndexes}
                    expandedSectionIndexes={expandedSectionIndexes}
                    id={id}
                    isSmall={isSmall}
                    shouldNotUnMountContent={shouldNotUnMountContent}
                />
            ))}
        </div>
    )
}
