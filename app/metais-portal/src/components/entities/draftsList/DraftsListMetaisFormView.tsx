import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'

interface Props {
    data?: ApiStandardRequestPreview
}
const DraftsListFormView: React.FC<Props> = ({ data }) => {
    const columns = [
        <>
            <InformationGridRow label="" value={data?.name} />
        </>,
        <>
            <InformationGridRow label="" value={data?.email} />
        </>,
        <>
            <InformationGridRow label="" value={data?.srName} />
        </>,
        <>
            <InformationGridRow label="" value={data?.createdAt} />
        </>,
        <>
            <InformationGridRow label="" value={data?.createdBy} />
        </>,
        <>
            <InformationGridRow label="" value={data?.standardRequestState} />
        </>,
        <>
            <InformationGridRow label="" value={data?.requestChannel} />
        </>,
        <>
            <InformationGridRow label="" value={data?.srName} />
        </>,
    ]
    return (
        <div>
            <form>{columns}</form>
        </div>
    )
}
export default DraftsListFormView
