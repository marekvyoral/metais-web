/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from 'react-i18next'

import { DetailRequestContainer } from '@/components/containers/DetailRequestContainer'
import { DetailRequestView } from '@/components/views/requestLists/DetailRequestView'

const RequestListDetailPage = () => {
    const { t } = useTranslation()

    document.title = `${t('titles.codeListRequestsDetail')} | MetaIS`

    return <DetailRequestContainer View={(props) => <DetailRequestView {...props} />} />
}

export default RequestListDetailPage
