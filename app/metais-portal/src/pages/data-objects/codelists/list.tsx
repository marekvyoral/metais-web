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

    return (
        <CodeListListContainer
            isOnlyPublishedPage={!isLoggedIn}
            View={(props) => (
                <CodeListListView
                    isError={props.isError}
                    isLoading={props.isLoading}
                    data={props.data}
                    filter={props.filter}
                    handleFilterChange={props.handleFilterChange}
                    isOnlyPublishedPage={props.isOnlyPublishedPage}
                />
            )}
        />
    )
}

export default CodeListPage
