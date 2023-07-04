import React from 'react'
import { Attribute, AttributeProfile, CiType } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'

import styles from '../detailViews.module.scss'

interface EntityDetailViewAttributes {
    data: CiType | AttributeProfile | undefined
}

export const EntityDetailViewAttributes = ({ data }: EntityDetailViewAttributes) => {
    const { t } = useTranslation()

    const columns: Array<ColumnDef<Attribute>> = [
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },

        {
            header: t('egov.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },

        {
            header: t('egov.technicalName'),
            accessorFn: (row) => row?.technicalName,
            enableSorting: true,
            id: 'technicalName',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.type'),
            accessorFn: (row) => row?.type,
            enableSorting: true,
            id: 'type',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.valid,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => <span>{t(`state.${ctx.row?.original?.valid}`)}</span>,
        },
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div className={styles.attributeGridRowBox}>
                    <InformationGridRow key={'name'} label={t('egov.name')} value={data?.name} />
                    <InformationGridRow key={'technicalName'} label={t('egov.technicalName')} value={data?.technicalName} />
                    <InformationGridRow key={'type'} label={t('egov.type')} value={t(`type.${data?.type}`)} />
                    <InformationGridRow key={'valid'} label={t('egov.valid')} value={t(`state.${data?.valid}`)} />
                    <InformationGridRow key={'description'} label={t('egov.description')} value={data?.description} />
                    <InformationGridRow key={'roles'} label={t('egov.roles')} value={data?.roleList} />
                </div>
            </div>
            <h3 className="govuk-heading-m">{t('egov.detail.profileAttributes')}</h3>
            <div>
                <Table columns={columns} data={data?.attributes} />
            </div>
        </>
    )
}
