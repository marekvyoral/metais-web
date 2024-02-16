import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import { IAccordionSection } from './Accordion'
import styles from './accordion.module.scss'

import { TextHeading, TransparentButtonWrapper } from '@isdd/idsk-ui-kit'
import { AlertTriangleIcon, ArrowDownIcon } from '@isdd/idsk-ui-kit/assets/images'

type Props = {
    index: number
    section: IAccordionSection
    setExpandedSectionIndexes: React.Dispatch<React.SetStateAction<boolean[]>>
    expandedSectionIndexes: boolean[]
    id: string
    isSmall?: boolean
    shouldNotUnMountContent?: boolean
    textHeadingSize?: 'S' | 'M' | 'L' | 'XL'
}

const newExpandedSectionIndexes = (newValue: boolean, index: number, oldArray: boolean[]) => {
    const newArr = [...oldArray]
    newArr[index] = newValue
    return newArr
}

export const AccordionSection = ({
    index,
    section,
    setExpandedSectionIndexes,
    expandedSectionIndexes,
    id,
    isSmall,
    shouldNotUnMountContent,
    textHeadingSize,
}: Props) => {
    const { t } = useTranslation()
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
            <div
                className={classNames('govuk-accordion__section-header', styles.headerDiv, {
                    [styles.noBorder]: isSmall,
                    [styles.noPaddingRight]: isSmall,
                })}
            >
                <TextHeading className={classNames('govuk-accordion__section-heading', styles.heading)} size={textHeadingSize ?? 'M'}>
                    <button
                        className={classNames('govuk-accordion__section-button', { [styles.smallHeading]: isSmall })}
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={id + index}
                        onClick={onToggle}
                        id={buttonId}
                    >
                        {section.title}
                    </button>

                    {!isSmall && <span className="govuk-accordion__icon" onClick={onToggle} />}
                </TextHeading>

                <div className={styles.flex}>
                    <div
                        className={classNames('govuk-accordion__section-summary govuk-body', styles.noMarginTop, {
                            [styles.smallSummary]: isSmall,
                        })}
                    >
                        {section.summary}
                    </div>
                    {section.error && <img src={AlertTriangleIcon} alt={t('accordion.sectionError')} />}
                    {isSmall && (
                        <TransparentButtonWrapper onClick={onToggle}>
                            <img className={classNames(styles.arrowDownIcon, { [styles.rotate180]: isExpanded })} src={ArrowDownIcon} alt="" />
                        </TransparentButtonWrapper>
                    )}
                </div>
            </div>
            <div
                className={classNames('govuk-accordion__section-content', { [styles.noPadding]: isSmall })}
                id={id + index}
                aria-labelledby={buttonId}
            >
                {shouldNotUnMountContent ? section.content : isExpanded ? section.content : null}
            </div>
        </div>
    )
}
