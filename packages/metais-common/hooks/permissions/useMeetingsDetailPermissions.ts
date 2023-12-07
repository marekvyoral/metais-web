import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { CAN_EDIT_MEETING_USER_ROLES } from '@isdd/metais-common/constants'
import { ApiMeetingActor, ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'

export enum Actions {
    EDIT = 'edit',
    SEE_PARTICIPATION_TO = 'seeParticipation',
    SEE_SUMMARIZE_LINK = 'seeSummarizeLink',
    SET_SUMMARIZE_LINK = 'setSummarizeLink',
    CHANGE_SUMMARIZE_LINK = 'changeSummarizeLink',
    SEE_CANCELED_STATE = 'seeCanceledState',
}

export enum Subject {
    MEETING = 'MEETING',
}

const hasRoles = (userRoles: string[], testedRoles: string[]) => {
    return userRoles.some((role) => {
        return testedRoles.indexOf(role) >= 0
    })
}

enum MeetingStateEnum {
    PAST = 'PAST',
    CANCELED = 'CANCELED',
    FUTURE = 'FUTURE',
    SUMMARIZED = 'SUMMARIZED',
    NOW = 'NOW',
}

export const useMeetingsDetailPermissions = (meetingDetailData: ApiMeetingRequest | undefined) => {
    const {
        state: { user },
    } = useAuth()

    const abilityContext = useAbilityContext()

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const canEditMeetingUserRole = hasRoles(user?.roles ?? [], CAN_EDIT_MEETING_USER_ROLES)
        const canceledState = meetingDetailData?.state === MeetingStateEnum.CANCELED
        const summarizeState = meetingDetailData?.state === MeetingStateEnum.SUMMARIZED
        const pastState = meetingDetailData?.state === MeetingStateEnum.PAST
        const createdByUser = meetingDetailData?.createdBy === user?.login
        const userIsGuest = meetingDetailData?.meetingActors?.some((guest: ApiMeetingActor) => guest.userName === user?.displayName)
        const dateNow = new Date()
        const endDateMeeting = new Date(meetingDetailData?.endDate as string)
        const startDateMeeting = new Date(meetingDetailData?.beginDate as string)
        const meetingIsFinished = endDateMeeting.getTime() - dateNow.getTime() < 0
        const meetingIsStarting = startDateMeeting.getTime() - dateNow.getTime() > 0

        if ((createdByUser || canEditMeetingUserRole) && meetingIsStarting && !canceledState) can(Actions.EDIT, Subject.MEETING)
        if (userIsGuest && !canceledState && !meetingIsFinished) can(Actions.SEE_PARTICIPATION_TO, Subject.MEETING)
        if (createdByUser || canEditMeetingUserRole) can(Actions.SET_SUMMARIZE_LINK, Subject.MEETING)
        if (summarizeState && (createdByUser || canEditMeetingUserRole)) can(Actions.CHANGE_SUMMARIZE_LINK, Subject.MEETING)
        if (pastState || summarizeState) can(Actions.SEE_SUMMARIZE_LINK, Subject.MEETING)
        if (canceledState) can(Actions.SEE_CANCELED_STATE, Subject.MEETING)

        abilityContext.update(rules)
    }, [
        abilityContext,
        meetingDetailData?.beginDate,
        meetingDetailData?.createdBy,
        meetingDetailData?.endDate,
        meetingDetailData?.meetingActors,
        meetingDetailData?.state,
        user,
    ])

    return {}
}
