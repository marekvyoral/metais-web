import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useTranslation } from 'react-i18next'

import { EditRequestContainer } from '@/components/containers/EditRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const RequestListEditPage = () => {
    const { t } = useTranslation()
    document.title = formatTitleString(t('codeList.breadcrumbs.requestEdit'))

    return <EditRequestContainer View={(props) => <CreateRequestView {...props} />} />
}

export default RequestListEditPage
