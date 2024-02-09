import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { EditCodeListContainerContainer } from '@/components/containers/EditCodeListContainer'
import { CodeListEditView } from '@/components/views/codeLists/CodeListEditView'
import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'

const EditCodeListPage = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    document.title = t('codeList.breadcrumbs.detailEdit')

    return (
        <CodeListPermissionsWrapper id={id ?? ''}>
            <EditCodeListContainerContainer View={(props) => <CodeListEditView {...props} />} />
        </CodeListPermissionsWrapper>
    )
}

export default EditCodeListPage
