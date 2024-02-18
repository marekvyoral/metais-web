import { useTranslation } from 'react-i18next'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { OlaContractDetailView } from '@/components/views/ola-contract-list/OlaContractDetailView'
import { OlaContractDetailContainer } from '@/components/containers/OlaContractDetailContainer'

export const OlaContractDetail = () => {
    const { t } = useTranslation()
    document.title = `${t('olaContracts.detail.heading')} ${META_IS_TITLE}`
    return (
        <OlaContractDetailContainer
            View={(props) => {
                document.title = formatTitleString(t('olaContracts.detail.title', { name: props.olaContract?.name }))
                return <OlaContractDetailView {...props} />
            }}
        />
    )
}
