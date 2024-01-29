import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { RefIdentifierDetailContainer } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'

const RefIdentifierDetailPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()

    document.title = `${t('titles.codeListDetail')} | MetaIS`

    return (
        <>
            <RefIdentifierDetailContainer id={id ?? ''} />
        </>
    )
}

export default RefIdentifierDetailPage
