import { useTranslation } from 'react-i18next'

import { RequestListContainer } from '@/components/containers/RequestListContainer'
import { RequestListsView } from '@/components/views/requestLists/RequestListsView'

const RequestListPage = () => {
    const { t } = useTranslation()

    document.title = `${t('titles.codeListRequestsList')} | MetaIS`

    return <RequestListContainer View={(props) => <RequestListsView {...props} />} />
}

export default RequestListPage
