import React, { useEffect } from 'react'
import classNames from 'classnames'

import { IAccordionSection } from './Accordion'
import styles from './accordion.module.scss'

import { AlertTriangleIcon } from '@isdd/idsk-ui-kit/assets/images'

type Props = {
    index: number
    section: IAccordionSection
    setExpandedSectionIndexes: React.Dispatch<React.SetStateAction<boolean[]>>
    expandedSectionIndexes: boolean[]
    id: string
}

const newExpandedSectionIndexes = (newValue: boolean, index: number, oldArray: boolean[]) => {
    const newArr = [...oldArray]
    newArr[index] = newValue
    return newArr
}

export const AccordionSection = ({ index, section, setExpandedSectionIndexes, expandedSectionIndexes, id }: Props) => {
    const isExpanded = expandedSectionIndexes[index]
    useEffect(() => {
        if (section?.onLoadOpen) setExpandedSectionIndexes(newExpandedSectionIndexes(true, index, expandedSectionIndexes))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onToggle = () => {
        setExpandedSectionIndexes(newExpandedSectionIndexes(!isExpanded, index, expandedSectionIndexes))
    }
    const buttonId = `${id}-heading-${index + 1}`
    return (
        <div key={index} className={classNames('govuk-accordion__section', { 'govuk-accordion__section--expanded': isExpanded })}>
            <div className={classNames('govuk-accordion__section-header', styles.headerDiv)}>
                <h3 className="govuk-accordion__section-heading">
                    <button className="govuk-accordion__section-button" type="button" aria-expanded={isExpanded} onClick={onToggle} id={buttonId}>
                        {section.title}
                    </button>

                    <span className="govuk-accordion__icon" onClick={onToggle} />
                </h3>

                <div className="govuk-accordion__section-summary govuk-body">{section.summary}</div>
                {section.error && <img src={AlertTriangleIcon} />}
            </div>
            <div className="govuk-accordion__section-content" aria-labelledby={buttonId}>
                {isExpanded ? section.content : null}
            </div>
        </div>
    )
}
