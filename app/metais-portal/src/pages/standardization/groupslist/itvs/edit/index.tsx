import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'
import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'

import { GroupEditContainer } from '@/components/containers/standardization/groups/GroupEditContainer'
import { GroupCreateEditView } from '@/components/views/standardization/groups/GroupCreateEditView'

const GroupEditItvsPage = () => {
    const { data: ksisvsGroup, isLoading, isError, error } = useFind2111({ shortName: KSIVS_SHORT_NAME })
    const groupId = Array.isArray(ksisvsGroup) ? ksisvsGroup[0].uuid : ksisvsGroup?.uuid

    return (
        <QueryFeedback loading={isLoading} error={isError} errorProps={{ errorMessage: error?.message, errorTitle: error?.type }} withChildren>
            <GroupEditContainer id={groupId} backGroupId="itvs" View={(props) => <GroupCreateEditView {...props} />} />
        </QueryFeedback>
    )
}
export default GroupEditItvsPage
