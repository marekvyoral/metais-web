import { Button, ButtonGroupRow } from '@isdd/idsk-ui-kit/index'
import { FindRelatedIdentitiesAndCountParams } from '@isdd/metais-common/api/generated/iam-swagger'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/page-size-select/PageSizeSelect'

import { sendBatchEmail } from '@/components/views/standartization/groups/groupMembersTableUtils'
import styles from '@/components/views/standartization/groups/styles.module.scss'
import { TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'

interface GroupMembersTableActionsProps {
    listParams: FindRelatedIdentitiesAndCountParams
    setListParams: (value: React.SetStateAction<FindRelatedIdentitiesAndCountParams>) => void
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedRows: Record<string, TableData>
}
const GroupMembersTableActions: React.FC<GroupMembersTableActionsProps> = ({ listParams, setListParams, setAddModalOpen, selectedRows }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.tableActionsWrapper}>
            <ButtonGroupRow>
                <Button label={t('groups.export')} variant="secondary" disabled />
                <Can I={Actions.CREATE} a={'sendEmail'}>
                    <Button
                        label={t('groups.sendEmail')}
                        variant="secondary"
                        disabled={Object.keys(selectedRows).length <= 0}
                        onClick={() => sendBatchEmail(selectedRows)}
                    />
                </Can>
                <Can I={Actions.EDIT} a={'groups'}>
                    <Button label={'+ ' + t('groups.addMember')} onClick={() => setAddModalOpen(true)} />
                </Can>
            </ButtonGroupRow>
            <PageSizeSelect
                id="perPageSelect"
                className={styles.perPageSelectWrapper}
                handlePagingSelect={(value) => {
                    setListParams({ ...listParams, perPage: Number(value) })
                }}
            />
        </div>
    )
}
export default GroupMembersTableActions
