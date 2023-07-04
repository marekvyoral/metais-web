import React from 'react'
import { SummarizingCardItemUi, SummarizingCardUi } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'

import styles from '../detailViews.module.scss'

interface SummCardProps {
    data: SummarizingCardUi | undefined
}

export const SummarizingCard = ({ data }: SummCardProps) => {
    const { t } = useTranslation()

    const columns: Array<ColumnDef<SummarizingCardItemUi>> = [
        {
            header: t('egov.order'),
            accessorFn: (row) => row?.attrOrder,
            enableSorting: true,
            id: 'order',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.attribute?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },

        {
            header: t('egov.description'),
            accessorFn: (row) => row?.attribute?.description,
            enableSorting: true,
            id: 'description',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },

        {
            header: t('egov.technicalName'),
            accessorFn: (row) => row?.attribute?.technicalName,
            enableSorting: true,
            id: 'technicalName',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.type'),
            accessorFn: (row) => row?.attribute?.type,
            enableSorting: true,
            id: 'type',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.attribute?.valid,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => <span>{t(`state.${ctx.row?.original?.attribute?.valid}`)}</span>,
        },
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div className={styles.attributeGridRowBox}>
                    <InformationGridRow
                        key={'showOwner'}
                        label={t('egov.detail.showOwner.heading')}
                        value={t(`egov.detail.showOwner.${data?.showOwner ?? false}`)}
                    />
                </div>
            </div>
            <h3 className="govuk-heading-m">{t('egov.detail.profileAttributes')}</h3>
            <div>
                <Table columns={columns} data={data?.summarizingCardItems} />
            </div>
        </>
    )
}
