import React, { useState, useId, PropsWithChildren, useEffect } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './accordion.module.scss'

import { AlertTriangleIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

type AccordionSection = {
    title: string
    error?: boolean
    summary?: React.ReactNode
    content: React.ReactNode
}

interface IAccordionContainerProps extends PropsWithChildren {
    sections: AccordionSection[]
    indexOfSectionToExpand?: number
}

export const AccordionContainer: React.FC<IAccordionContainerProps> = ({ sections, indexOfSectionToExpand }) => {
    const { t } = useTranslation()
    const id = useId()

    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(Array(sections.length).fill(false))

    useEffect(() => {
        const sectionsArray = Array(sections.length).fill(false)
        if (indexOfSectionToExpand || indexOfSectionToExpand === 0) {
            setExpandedSectionIndexes([...sectionsArray.slice(0, indexOfSectionToExpand), true, ...sectionsArray.slice(indexOfSectionToExpand + 1)])
        }
    }, [indexOfSectionToExpand, sections.length])

    const isAllExpanded = expandedSectionIndexes.every((x) => x)

    const toggleAllExpanded = () => {
        setExpandedSectionIndexes(Array(sections.length).fill(!isAllExpanded))
    }

    return (
        <div className="govuk-accordion">
            <div className="govuk-accordion__controls">
                <Button
                    variant="secondary"
                    aria-expanded={isAllExpanded}
                    label={isAllExpanded ? t('accordion.closeAll') : t('accordion.openAll')}
                    onClick={toggleAllExpanded}
                />
            </div>
            {sections.map((section, index) => {
                const isExpanded = expandedSectionIndexes[index]
                const onToggle = () =>
                    setExpandedSectionIndexes((prev) => {
                        const newArr = [...prev]
                        newArr[index] = !isExpanded
                        return newArr
                    })
                const buttonId = `${id}-heading-${index + 1}`
                return (
                    <div key={index} className={classNames('govuk-accordion__section', { 'govuk-accordion__section--expanded': isExpanded })}>
                        <div className={classNames('govuk-accordion__section-header', styles.headerDiv)}>
                            <h3 className="govuk-accordion__section-heading">
                                <button
                                    className="govuk-accordion__section-button"
                                    type="button"
                                    aria-expanded={isExpanded}
                                    onClick={onToggle}
                                    id={buttonId}
                                >
                                    {section.title}
                                </button>

                                <span className="govuk-accordion__icon" onClick={onToggle} />
                            </h3>

                            <div className="govuk-accordion__section-summary govuk-body">{section.summary}</div>
                            {section.error && <img src={AlertTriangleIcon} />}
                        </div>
                        <div className="govuk-accordion__section-content" aria-labelledby={buttonId}>
                            {section.content}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
