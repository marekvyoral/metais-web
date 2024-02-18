import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { GroupCreateContainer } from '@/components/containers/standardization/groups/GroupCreateContainer'

const CreateGroupPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.groupCreate')} ${META_IS_TITLE}`
    return <GroupCreateContainer />
}

export default CreateGroupPage
