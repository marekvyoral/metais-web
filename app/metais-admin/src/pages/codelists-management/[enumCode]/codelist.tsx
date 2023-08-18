import { TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useParams } from 'react-router-dom'

const CodelistDetail: React.FC = () => {
    const { enumCode } = useParams()

    return <TextHeading size="L">{enumCode}</TextHeading>
}

export default CodelistDetail
