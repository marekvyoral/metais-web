import { useParams } from 'react-router-dom'

import { CodeListDetailContainer } from '@/components/containers/CodeListDetailContainer'
import { CodeListDetailWrapper } from '@/components/views/codeLists/CodeListDetailWrapper'
import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'

const CodeListDetailPage = () => {
    const { id } = useParams()

    return (
        <CodeListPermissionsWrapper id={id ?? ''}>
            <CodeListDetailContainer id={id} View={(props) => <CodeListDetailWrapper {...props} />} />
        </CodeListPermissionsWrapper>
    )
}

export default CodeListDetailPage
