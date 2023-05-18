import React, { useState, useEffect } from 'react'

/**
 * Create associative array object, where keys are numbers from 0 to "length" and values are equal "defaultValue"
 * example: createAssociativeArray(3, false) = {0: false, 1: false; 2: false}
 * @param length length
 * @param defaultValue value (boolean)
 * @returns associative Array
 */
const createAssociativeArray: (length: number, defaultValue: boolean) => { [key: string]: boolean } = (length, defaultValue) => {
  return Array.apply(false, Array(length)).reduce<{ [key: string]: boolean }>((prev, _curr, index) => ({ ...prev, [index]: defaultValue }), {})
}

type AccordionContainerProps = {
  children: React.ReactNode
  id: string
}

const AccordionContainer: React.FC<AccordionContainerProps> = ({ children, id }) => {
  const childCount = Array.isArray(children) ? children.length : 0

  const [expandedChildIndexes, setExpandedChildIndexes] = useState<{ [key: string]: boolean }>(createAssociativeArray(childCount, false))
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  useEffect(() => {
    if (!expandedChildIndexes) {
      return
    }
    const countOfExpanded = Object.keys(expandedChildIndexes).reduce<number>((prev, _, index) => prev + (expandedChildIndexes[index] ? 1 : 0), 0)
    setIsAllExpanded(countOfExpanded === childCount ? true : false)
  }, [expandedChildIndexes, childCount])

  const toggleAllExpanded = () => {
    setExpandedChildIndexes(createAssociativeArray(childCount, !isAllExpanded))
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
          const onToggle = () => setExpandedChildIndexes((vals) => ({ ...vals, [index]: !expanded }))
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

type AccordionSectionProps = {
  title: string
  summary: React.ReactNode
  children: React.ReactNode
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ children }) => {
  return <>{children}</>
}

export { AccordionContainer, AccordionSection }
