import React, { useState, useId } from 'react'

const AccordionContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
    const childCount = Array.isArray(children) ? children.length : 0
    const id = useId()

    const [expandedChildIndexes, setExpandedChildIndexes] = useState<boolean[]>(Array(childCount).fill(false))
    const isAllExpanded = expandedChildIndexes.every((x) => x)

    const toggleAllExpanded = () => {
        setExpandedChildIndexes(Array(childCount).fill(!isAllExpanded))
    }

    return (
        <div className="govuk-accordion">
            <div className="govuk-accordion__controls">
                <button className="govuk-accordion__open-all" type="button" aria-expanded={isAllExpanded} onClick={toggleAllExpanded}>
                    {isAllExpanded ? 'Zatvoriť všetky' : 'Otvoriť všetky'}
                    <span className="govuk-visually-hidden govuk-accordion__controls-span">sekcie</span>
                </button>
            </div>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    const title = (child.props && child.props.title) || 'title' + index
                    const summary = (child.props && child.props.summary) || 'summary' + index
                    const expanded = expandedChildIndexes && expandedChildIndexes[index]
                    const onToggle = () =>
                        setExpandedChildIndexes((prev) => {
                            const newArr = [...prev]
                            newArr[index] = !expanded
                            return newArr
                        })
                    return (
                        <div className={'govuk-accordion__section' + (expanded ? ' govuk-accordion__section--expanded' : '')}>
                            <div className="govuk-accordion__section-header">
                                <h2 className="govuk-accordion__section-heading">
                                    <button className="govuk-accordion__section-button" onClick={onToggle} id={id + '-heading-' + (index + 1)}>
                                        {title}
                                    </button>
                                    <span className="govuk-accordion__icon" onClick={onToggle} />
                                </h2>
                                <div className="govuk-accordion__section-summary govuk-body">{summary}</div>
                            </div>
                            <div className="govuk-accordion__section-content" aria-labelledby={id + '-heading-' + (index + 1)}>
                                <p className="govuk-body">{child}</p>
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}

interface IAccordionSectionProps extends React.PropsWithChildren {
    title: string
    summary: React.ReactNode
}

const AccordionSection: React.FC<IAccordionSectionProps> = ({ children }) => {
    return <>{children}</>
}

export { AccordionContainer, AccordionSection }
