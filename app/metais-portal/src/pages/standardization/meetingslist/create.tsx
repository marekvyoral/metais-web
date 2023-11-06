import React from 'react'
import { useTranslation } from 'react-i18next'

import { MeetingCreateContainer } from '@/components/containers/standardization/meetings/MeetingCreateContainer'

const CreateMeetingPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.meetingsCreate')} | MetaIS`
    return <MeetingCreateContainer />
}

export default CreateMeetingPage
