import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { ReportDefinition } from '@isdd/metais-common/api/generated/report-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { RelationAttribute } from '@/components/entities/cards/RelationAttribute'

interface IReportsCardProps {
    data?: ReportDefinition
}

export const ReportsCard: React.FC<IReportsCardProps> = ({ data }) => {
    const { t } = useTranslation()
    return (
        <Tabs
            tabList={[
                {
                    id: 'reports.card.basicInfo',
                    title: t('reports.card.basicInfo'),
                    content: (
                        <>
                            <RelationAttribute name={t('reports.card.reportName')} value={data?.name} />
                            <RelationAttribute name={t('reports.card.description')} value={data?.description} />
                            <RelationAttribute name={t('reports.card.category')} value={data?.category?.name} />
                        </>
                    ),
                },
            ]}
        />
    )
}
