import { useTranslation } from 'react-i18next'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { CodeListListContainer } from '@/components/containers/CodeListListContainer'
import { CodeListListView } from '@/components/views/codeLists/CodeListListView'

const CodeListPage = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isLoggedIn = !!user

    document.title = `${t('titles.codeListList')} ${META_IS_TITLE}`

    return <CodeListListContainer isOnlyPublishedPage={!isLoggedIn} View={(props) => <CodeListListView {...props} />} />
}

export default CodeListPage
