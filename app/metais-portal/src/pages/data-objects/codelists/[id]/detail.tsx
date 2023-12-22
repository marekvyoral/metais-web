import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CodeListDetailContainer } from '@/components/containers/CodeListDetailContainer'
import { CodeListDetailWrapper } from '@/components/views/codeLists/CodeListDetailWrapper'
import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'

const CodeListDetailPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()

    document.title = `${t('titles.codeListDetail')} | MetaIS`

    return (
        <CodeListPermissionsWrapper id={id ?? ''}>
            <CodeListDetailContainer id={id} View={(props) => <CodeListDetailWrapper {...props} />} />
        </CodeListPermissionsWrapper>
    )
}

export default CodeListDetailPage
