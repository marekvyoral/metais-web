import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useTranslation } from 'react-i18next'

import { OlaContractEditContainer } from '@/components/containers/OlaContractEditContainer'
import { OlaContractSaveView } from '@/components/views/ola-contract-list/OlaContractSaveView'

export const OlaContractEdit = () => {
    const { t } = useTranslation()
    return (
        <OlaContractEditContainer
            View={(props) => {
                document.title = formatTitleString(t('olaContracts.headingEdit', { itemName: props.olaContract?.name }))
                return <OlaContractSaveView {...props} isEdit />
            }}
        />
    )
}
