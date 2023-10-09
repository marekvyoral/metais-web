import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, API_STANDARD_REQUEST_ATTRIBUTES } from '@isdd/metais-common/api'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import sanitizeHtml from 'sanitize-html'

import { customMainAttributesForVersion2 } from '@/componentHelpers'

interface Props {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
}
export const DraftListDetailVersion2SectionGeneral: React.FC<Props> = ({ data, guiAttributes }) => {
    return (
        <div>
            {customMainAttributesForVersion2.map((attribute) => {
                if (data?.[attribute] && data?.[attribute] != '-') {
                    if (attribute === API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription1)
                        return (
                            <InformationGridRow
                                key={attribute}
                                value={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.[attribute] ?? '') }} />}
                                label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1, guiAttributes) ?? ''}
                                hideIcon
                            />
                        )
                    return (
                        <InformationGridRow
                            key={attribute}
                            value={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.[attribute] ?? '') }} />}
                            label={getInfoGuiProfilStandardRequest(attribute, guiAttributes) ?? ''}
                            hideIcon
                        />
                    )
                }
            })}
        </div>
    )
}
