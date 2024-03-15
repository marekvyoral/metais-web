import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { MutationFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './userView.module.scss'
interface IUserDetail {
    userData: Identity | undefined
    userId: string
}

export const UserDetail: React.FC<IUserDetail> = ({ userData, userId }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()

    const detailRows = [
        { label: t('managementList.firstName'), value: userData?.firstName },
        { label: t('managementList.lastName'), value: userData?.lastName },
        { label: t('managementList.displayName'), value: userData?.displayName },
        { label: t('managementList.loginEmail'), value: userData?.login },
        { label: t('managementList.position'), value: userData?.position },
        { label: t('managementList.mobile'), value: userData?.mobile },
    ]

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <>
            <FlexColumnReverseWrapper>
                <div className={styles.headerWrapper}>
                    <TextHeading size="XL">{`${t('managementList.detailHeading')} - ${userData?.displayName}`}</TextHeading>
                    <Button
                        label={t('managementList.edit')}
                        onClick={() => navigate(AdminRouteNames.USER_MANAGEMENT + '/edit/' + userId, { state: { from: location } })}
                    />
                </div>
                <div ref={wrapperRef}>
                    <MutationFeedback success={isActionSuccess.value} />
                </div>
            </FlexColumnReverseWrapper>

            <DefinitionList>
                {detailRows.map((item, index) => (
                    <InformationGridRow key={index} label={item.label} value={item.value} hideIcon />
                ))}
            </DefinitionList>
        </>
    )
}
