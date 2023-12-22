import { useTranslation } from 'react-i18next'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { CodeListListContainer } from '@/components/containers/CodeListListContainer'
import { CodeListListView } from '@/components/views/codeLists/CodeListListView'

const CodeListPage = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isLoggedIn = !!user

    document.title = `${t('titles.codeListList')} | MetaIS`

    return <CodeListListContainer isOnlyPublishedPage={!isLoggedIn} View={(props) => <CodeListListView {...props} />} />
}

export default CodeListPage
