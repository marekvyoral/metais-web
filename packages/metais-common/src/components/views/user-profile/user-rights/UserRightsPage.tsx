import React from 'react'
import { TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import styles from './userRights.module.scss'
import { UserRightsPOItem } from './UserRightsPOItem'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { PO } from '@isdd/metais-common/constants'

export const UserRightsPage = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const userPoUuids = user?.groupData.map((po) => po.orgId) ?? []
    const hasOrganizations = userPoUuids && userPoUuids.length > 0

    const {
        data: usersPOData,
        isLoading,
        isError,
        fetchStatus,
    } = useReadCiList1(
        {
            filter: { type: [PO], uuid: userPoUuids },
        },
        { query: { enabled: hasOrganizations } },
    )

    const isUserPODataLoading = isLoading && fetchStatus != 'idle'

    return (
        <>
            <TextHeading size="L">{t('userProfile.rightsHeading')}</TextHeading>
            <QueryFeedback loading={isUserPODataLoading} error={isError}>
                {hasOrganizations && (
                    <ul className={styles.ul}>
                        {usersPOData?.configurationItemSet?.map((item) => (
                            <UserRightsPOItem key={item.uuid} poItem={item} />
                        ))}
                    </ul>
                )}
                {!hasOrganizations && !isUserPODataLoading && <TextBody className={styles.grey}>{t('userProfile.noRights')}</TextBody>}
            </QueryFeedback>
        </>
    )
}
