import React from 'react'
import { TextHeading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import styles from './userRights.module.scss'
import { UserRightsPOItem } from './UserRightsPOItem'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useReadCiList1 } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'

export const UserRightsPage = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const userPoUuids = user?.groupData.map((po) => po.orgId) ?? []

    const {
        data: usersPOData,
        isLoading,
        isError,
    } = useReadCiList1({
        filter: { type: ['PO'], uuid: userPoUuids },
    })

    return (
        <>
            <TextHeading size="L">{t('userProfile.rightsHeading')}</TextHeading>
            <QueryFeedback loading={isLoading} error={isError}>
                <ul className={styles.ul}>
                    {usersPOData?.configurationItemSet?.map((item) => (
                        <UserRightsPOItem key={item.uuid} poItem={item} />
                    ))}
                </ul>
            </QueryFeedback>
        </>
    )
}
