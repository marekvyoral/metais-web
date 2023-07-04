import { CiTypePreview } from '@isdd/metais-common/api'
import React from 'react'

interface ConnectionViewProps {
    sources: CiTypePreview[] | undefined
    targets: CiTypePreview[] | undefined
}

const ConnectionView = ({ sources, targets }: ConnectionViewProps) => {
    return <div>ConnectionView</div>
}

export default ConnectionView
