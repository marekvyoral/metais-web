import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { EkoCode } from '@isdd/metais-common/api/generated/tco-swagger'
import { ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import classNames from 'classnames'
import { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import { TEkoCodeDecorated } from '@/components/views/eko/ekoCodes'
import styles from '@/components/views/eko/ekoView.module.scss'

export interface IResultApiCall {
    isSuccess: boolean
    isError: boolean
    message: React.ReactNode
}

export const reduceTableDataToObject = <T extends { ekoCode?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.ekoCode) {
            result[item.ekoCode] = item
        }
        return result
    }, {})
}

export const enrichEkoDataMaper = (data: EkoCode[]): TEkoCodeDecorated[] => {
    return data.map((item) => {
        return { ...item, selected: false } as TEkoCodeDecorated
    })
}

export const getTableColumns = (
    rowSelection: Record<string, TEkoCodeDecorated>,
    handleAllCheckboxChange: (rows: TEkoCodeDecorated[]) => void,
    data: TEkoCodeDecorated[],
    handleCheckboxChange: (row: Row<TEkoCodeDecorated>) => void,
    t: TFunction<'translation', undefined, 'translation'>,
): ColumnDef<TEkoCodeDecorated>[] => {
    return [
        {
            accessorFn: (row) => row?.ekoCode,
            header: ({ table }: { table: ITable<TEkoCodeDecorated> }) => {
                const checked = table.getRowModel().rows.every((row) => (row?.original?.ekoCode ? !!rowSelection[row?.original?.ekoCode] : false))
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={() => handleAllCheckboxChange(data ?? [])}
                            checked={checked}
                            containerClassName={styles.marginBottom15}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }: { row: Row<TEkoCodeDecorated> }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small" id={`checkbox_div_${row.id}`}>
                    <CheckBox
                        label=""
                        name="checkbox"
                        id={`checkbox_${row.id}`}
                        value="true"
                        checked={row?.original?.ekoCode ? !!rowSelection[row?.original?.ekoCode] : false}
                        containerClassName={styles.marginBottom15}
                        onChange={() => handleCheckboxChange(row)}
                    />
                </div>
            ),
        },
        {
            header: t('eko.ekoCode'),
            accessorFn: (row) => row?.ekoCode,
            enableSorting: true,
            id: 'ekoCode',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <TextBody key={`textBody_${ctx?.row?.id}`} size="S" className={styles.marginvBottom0}>
                    <Link
                        to={'./' + ctx?.row?.original?.ekoCode}
                        className={classNames({ [styles.bold]: ctx?.row?.original?.ekoCode && !!rowSelection[ctx?.row?.original?.ekoCode] })}
                    >
                        {ctx?.getValue?.() as string}
                    </Link>
                </TextBody>
            ),
        },
        {
            header: t('eko.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.name,
            },
            cell: (ctx) => <span>{ctx?.row?.original?.name}</span>,
        },
        {
            header: t('eko.ekoCodeState'),
            accessorFn: (row) => row?.ekoCodeState,
            enableSorting: true,
            id: 'ekoCodeState',
            meta: {
                getCellContext: (ctx) => t(`ekoValidity.${ctx.row?.original?.ekoCodeState}`),
            },
            cell: (ctx) => <span>{t(`ekoValidity.${ctx.row?.original?.ekoCodeState}`)}</span>,
        },
    ]
}
