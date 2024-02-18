import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { RequestListContainer } from '@/components/containers/RequestListContainer'
import { RequestListsView } from '@/components/views/requestLists/RequestListsView'

const RequestListPage = () => {
    const { t } = useTranslation()

    document.title = `${t('titles.codeListRequestsList')} ${META_IS_TITLE}`

    return <RequestListContainer View={(props) => <RequestListsView {...props} />} />
}

export default RequestListPage
