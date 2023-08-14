import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useNavigate } from 'react-router-dom'

import styles from './userView.module.scss'

interface IUserDetail {
    userData: Identity | undefined
    userId: string
}

export const UserDetail: React.FC<IUserDetail> = ({ userData, userId }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

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
            <TextHeading size="L">{t('managementList.detailHeading')}</TextHeading>
            <div className={styles.attributeGridRowBox}>
                {detailRows.map((item, index) => (
                    <InformationGridRow key={index} label={item.label} value={item.value} hideIcon />
                ))}
            </div>
            <Button label={t('managementList.edit')} onClick={() => navigate('/managementlist/edit/' + userId)} />
        </>
    )
}
