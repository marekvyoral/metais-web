import React from "react";

type AccordionContainerProps = {
    children: React.ReactNode,
}

const AccordionContainer: React.FC<AccordionContainerProps> = ({children}) => {
  return (
    <div className="govuk-accordion" data-module="idsk-accordion" id="1"  data-attribute="value">
        <div className="govuk-accordion__controls">
            <button className="govuk-accordion__open-all" data-open-title="Otvoriť všetky" data-close-title="Zatvoriť všetky" type="button" aria-expanded="false">
                <span className="govuk-visually-hidden govuk-accordion__controls-span" data-section-title="sekcie"></span>
            </button>
        </div>
        {children}
    </div>
  )  
}

type AccordionSectionProps = {
    title: string,
    summary: string,
    children: React.ReactNode,
}

const AccordionSection: React.FC<AccordionSectionProps> = ({title, summary, children}) => {
    return(
        <div className="govuk-accordion__section">
            <div className="govuk-accordion__section-header">
            <h2 className="govuk-accordion__section-heading">
                <span className="govuk-accordion__section-button" id="1-heading-1">
                {title}
                </span>
            </h2>
                <div className="govuk-accordion__section-summary govuk-body" id="1-summary-1">
                {summary}
                </div>
            </div>
            <div id="1-content-1" className="govuk-accordion__section-content" aria-labelledby="1-heading-1">
            <p className='govuk-body'>{children}</p>
            </div>
        </div>
  )
}
export {AccordionContainer, AccordionSection}