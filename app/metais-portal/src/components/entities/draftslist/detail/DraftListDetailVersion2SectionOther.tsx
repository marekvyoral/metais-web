import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import sanitizeHtml from 'sanitize-html'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { customAttributesForVersion2 } from '@/componentHelpers'

interface Props {
    data: {
        requestData?: ApiStandardRequest
        guiAttributes?: Attribute[]
    }
}
export const DraftListDetailVersion2SectionOther: React.FC<Props> = ({ data }) => {
    const { requestData, guiAttributes } = data
    return (
        <div>
            {customAttributesForVersion2.map((attribute) => {
                if (requestData?.[attribute] && requestData?.[attribute] != '-')
                    return (
                        <InformationGridRow
                            key={attribute}
                            value={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(requestData?.[attribute] ?? '') }} />}
                            label={getInfoGuiProfilStandardRequest(attribute, guiAttributes) ?? ''}
                            hideIcon
                        />
                    )
            })}
        </div>
    )
}
