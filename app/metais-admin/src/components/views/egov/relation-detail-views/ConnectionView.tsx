import React from 'react'
import { CiTypePreview } from '@isdd/metais-common/api'

import ConnectionItem from './ConnectionItem'

interface ConnectionViewProps {
    sources: CiTypePreview[] | undefined
    targets: CiTypePreview[] | undefined
}

const ConnectionView = ({ sources, targets }: ConnectionViewProps) => {
    const arrayWithPreviews = sources && sources?.length > 0 ? sources : targets

    return (
        <div>
            {arrayWithPreviews?.map((previewType, index) => {
                return (
                    <ConnectionItem
                        source={sources && sources?.length > 0 ? previewType : undefined}
                        target={targets?.[index]}
                        key={previewType?.id}
                    />
                )
            })}
        </div>
    )
}

export default ConnectionView
