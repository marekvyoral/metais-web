import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { GroupEditContainer } from '@/components/containers/standardization/groups/GroupEditContainer'
import { GroupCreateEditView } from '@/components/views/standardization/groups/GroupCreateEditView'

const GroupEditPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.groupDetail')} | MetaIS`
    const { groupId } = useParams()

    return (
        <GroupEditContainer
            id={groupId}
            View={(props) => <GroupCreateEditView onSubmit={props.onSubmit} goBack={props.goBack} infoData={props.infoData} />}
        />
    )
}
export default GroupEditPage
