import React, { useState, useId, PropsWithChildren } from 'react'
import classNames from 'classnames'

type AccordionSection = {
    title: string
    summary: React.ReactNode
    content: React.ReactNode
}

interface IAccordionContainerProps extends PropsWithChildren {
    sections: AccordionSection[]
}

export const AccordionContainer: React.FC<IAccordionContainerProps> = ({ sections }) => {
    const id = useId()

    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(() => Array(sections.length).fill(false))
    const isAllExpanded = expandedSectionIndexes.every((x) => x)

    const toggleAllExpanded = () => {
        setExpandedSectionIndexes(Array(sections.length).fill(!isAllExpanded))
    }

    return (
        <div className="govuk-accordion">
            <div className="govuk-accordion__controls">
                <button className="govuk-accordion__open-all" type="button" aria-expanded={isAllExpanded} onClick={toggleAllExpanded}>
                    {isAllExpanded ? 'Zatvoriť všetky' : 'Otvoriť všetky'}
                    <span className="govuk-visually-hidden govuk-accordion__controls-span">sekcie</span>
                </button>
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
                        <div className="govuk-accordion__section-header">
                            <h2 className="govuk-accordion__section-heading">
                                <button className="govuk-accordion__section-button" aria-expanded={isExpanded} onClick={onToggle} id={buttonId}>
                                    {section.title}
                                </button>
                                <span className="govuk-accordion__icon" onClick={onToggle} />
                            </h2>
                            <div className="govuk-accordion__section-summary govuk-body">{section.summary}</div>
                        </div>
                        <div className="govuk-accordion__section-content" aria-labelledby={buttonId}>
                            <p className="govuk-body">{section.content}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
