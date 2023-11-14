import React from 'react'
import { useTranslation } from 'react-i18next'

import { GroupCreateContainer } from '@/components/containers/standardization/groups/GroupCreateContainer'

const CreateGroupPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.groupCreate')} | MetaIS`
    return <GroupCreateContainer />
}

export default CreateGroupPage
