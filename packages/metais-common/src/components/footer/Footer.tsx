import React from 'react'

import { FooterSection } from './FooterSection'
import { FooterMeta, FooterMetaList } from './FooterMeta'

type Props = {
    sections: FooterSection[]
    metaList: FooterMetaList[]
}

export const Footer: React.FC<Props> = ({ sections, metaList }) => {
    return (
        <footer className="govuk-footer ">
            <div className="govuk-width-container ">
                <div className="govuk-footer__navigation">
                    {sections.map((section, index) => (
                        <FooterSection key={index} itemList={section.itemList} header={section.header} columnsCount={section.columnsCount} />
                    ))}
                </div>
                <hr className="govuk-footer__section-break" />
                <FooterMeta metaList={metaList} />
            </div>
        </footer>
    )
}
