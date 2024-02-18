import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { MeetingCreateContainer } from '@/components/containers/standardization/meetings/MeetingCreateContainer'

const CreateMeetingPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.meetingsCreate')} ${META_IS_TITLE}`
    return <MeetingCreateContainer />
}

export default CreateMeetingPage
