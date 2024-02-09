import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useTranslation } from 'react-i18next'

import { CreateRequestContainer } from '@/components/containers/CreateRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const RequestListCreatePage = () => {
    const { t } = useTranslation()
    document.title = formatTitleString(t('codeList.breadcrumbs.requestCreate'))

    return <CreateRequestContainer View={(props) => <CreateRequestView {...props} />} />
}

export default RequestListCreatePage
