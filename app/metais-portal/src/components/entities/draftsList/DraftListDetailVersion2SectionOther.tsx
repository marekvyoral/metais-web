import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute } from '@isdd/metais-common/api'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import sanitizeHtml from 'sanitize-html'

import { customAttributesForVersion2 } from '@/componentHelpers'

interface Props {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
}
export const DraftListDetailVersion2SectionOther: React.FC<Props> = ({ data, guiAttributes }) => {
    return (
        <div>
            {customAttributesForVersion2.map((attribute) => {
                if (data?.[attribute] && data?.[attribute] != '-')
                    return (
                        <InformationGridRow
                            key={attribute}
                            value={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.[attribute] ?? '') }} />}
                            label={getInfoGuiProfilStandardRequest(attribute, guiAttributes) ?? ''}
                            hideIcon
                        />
                    )
            })}
        </div>
    )
}
