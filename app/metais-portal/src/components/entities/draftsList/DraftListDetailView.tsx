import React from 'react'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { AccordionContainer } from '@isdd/idsk-ui-kit/index'

import { DraftListDetailMainSection } from './DraftListDetailMainSection'
import { DraftListDetailVersion2SectionGeneral } from './DraftListDetailVersion2SectionGeneral'
import { DraftListDetailVersion2SectionOther } from './DraftListDetailVersion2SectionOther'

interface Props {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
    workGroup?: Group
}
export const DraftListDetailView: React.FC<Props> = ({ data, guiAttributes, workGroup }) => {
    const { t } = useTranslation()

    const isVersion2 = data?.version === 2

    return (
        <AccordionContainer
            sections={[
                {
                    title: t('DraftsList.detail.accordion.basicInformation'),
                    onLoadOpen: true,
                    content: <DraftListDetailMainSection data={data} guiAttributes={guiAttributes} workGroup={workGroup} />,
                },

                ...(isVersion2
                    ? [
                          {
                              title: t('DraftsList.detail.accordion.generalDescription'),
                              onLoadOpen: false,
                              content: <DraftListDetailVersion2SectionGeneral data={data} guiAttributes={guiAttributes} />,
                          },
                          {
                              title: t('DraftsList.detail.accordion.otherDescription'),
                              onLoadOpen: false,
                              content: <DraftListDetailVersion2SectionOther data={data} guiAttributes={guiAttributes} />,
                          },
                      ]
                    : []),
            ]}
        />
    )
}
