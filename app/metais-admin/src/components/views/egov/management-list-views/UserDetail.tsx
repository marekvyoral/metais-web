import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useLocation, useNavigate } from 'react-router-dom'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { MutationFeedback } from '@isdd/metais-common/index'

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
        { label: t('managementList.email'), value: userData?.email },
        { label: t('managementList.position'), value: userData?.position },
        { label: t('managementList.phone'), value: userData?.phone },
        { label: t('managementList.mobile'), value: userData?.mobile },
        { label: t('managementList.login'), value: userData?.login },
    ]

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('managementList.detailHeading')}</TextHeading>
                <MutationFeedback error={false} success={isActionSuccess.value} />
            </FlexColumnReverseWrapper>

            <DefinitionList>
                {detailRows.map((item, index) => (
                    <InformationGridRow key={index} label={item.label} value={item.value} hideIcon />
                ))}
            </DefinitionList>
            <Button
                label={t('managementList.edit')}
                onClick={() => navigate(AdminRouteNames.USER_MANAGEMENT + '/edit/' + userId, { state: { from: location } })}
            />
        </>
    )
}
