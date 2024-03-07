import React from 'react'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { useTranslation } from 'react-i18next'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { AccordionContainer } from '@isdd/idsk-ui-kit/index'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { DraftListDetailMainSection } from '@/components/entities/draftslist/detail/DraftListDetailMainSection'
import { DraftListDetailVersion2SectionGeneral } from '@/components/entities/draftslist/detail/DraftListDetailVersion2SectionGeneral'
import { DraftListDetailVersion2SectionOther } from '@/components/entities/draftslist/detail/DraftListDetailVersion2SectionOther'

interface Props {
    data: {
        requestData?: ApiStandardRequest
        guiAttributes?: Attribute[]
        workGroup?: Group
    }
}
export const DraftListDetailView: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation()

    return (
        <AccordionContainer
            sections={[
                {
                    title: t('DraftsList.detail.accordion.basicInformation'),
                    onLoadOpen: true,
                    content: <DraftListDetailMainSection data={data} />,
                },

                {
                    title: t('DraftsList.detail.accordion.generalDescription'),
                    onLoadOpen: false,
                    content: <DraftListDetailVersion2SectionGeneral data={data} />,
                },
                {
                    title: t('DraftsList.detail.accordion.otherDescription'),
                    onLoadOpen: false,
                    content: <DraftListDetailVersion2SectionOther data={data} />,
                },
            ]}
        />
    )
}
