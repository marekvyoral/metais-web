import { ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useMeetingsDetailPermissions } from '@isdd/metais-common/hooks/permissions/useMeetingsDetailPermissions'

interface IMMeetingsDetailPermissionsWrapper {
    meetingDetailData: ApiMeetingRequest | undefined
    children: JSX.Element
}

export const MeetingsDetailPermissionsWrapper = ({ children, meetingDetailData }: IMMeetingsDetailPermissionsWrapper) => {
    const ability = useAbilityContext()
    useMeetingsDetailPermissions(meetingDetailData)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
