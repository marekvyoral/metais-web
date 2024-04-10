import { Button, ButtonLink, ButtonPopup, CheckBox, Input } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Row, ColumnDef, CellContext, Table as ITable } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { GetAll200, GetAllLocale, GetAllUserInterface } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { UseFormRegister } from 'react-hook-form'

import styles from '@/components/views/localization/local.module.scss'
import { getKey } from '@/components/views/localization/LocalizationTable'

export enum LocalizationFilterEnum {
    LANG = 'language',
    TYPE = 'type',
}

export type LocalizationFilterMap = {
    type: GetAllUserInterface
    language: GetAllLocale | 'ALL'
}

export type NameValueObj =
    | {
          uuid: string
          value: string
      }
    | {
          uuid: string
          value: string
          secValue: string
      }

export const hasSecValue = (obj: NameValueObj): obj is { uuid: string; value: string; secValue: string } => {
    return 'secValue' in obj
}

export type DataValue =
    | string
    | {
          sk: string
          en: string
      }

export type DataRecord = Record<string, DataValue>

export const isObjectWithSkAndEn = (value: DataValue): value is { sk: string; en: string } => {
    return typeof value === 'object' && 'sk' in value && 'en' in value
}

export type CustomPagination = {
    startOfList: number
    endOfList: number
    pageNumber: number
    pageSize: number
    dataLength: number
}

export const getPagination = (pageNumber: number, pageSize: number, dataLength: number): CustomPagination => {
    const startOfList = pageNumber * pageSize - pageSize
    const endOfList = pageNumber * pageSize

    return {
        startOfList,
        endOfList,
        pageNumber,
        pageSize,
        dataLength,
    }
}

export type SecondLanguage = 'EN' | null

type LocalizationColumnsProps = {
    rowSelection: DataRecord
    dataArr: NameValueObj[]
    t: TFunction
    firstLanguage: GetAllLocale
    secondLanguage: SecondLanguage
    handleAllCheckboxChange: (rows: NameValueObj[]) => void
    handleCheckboxChange: (row: Row<NameValueObj>) => void
    areBeingEdited: Record<string, NameValueObj>
    register: UseFormRegister<Record<string, string | { sk: string; en: string }>>
    submit: (uuid: string) => void
    onCancel: (uuid: string) => void
    onEdit: (uuid: NameValueObj) => void
}

enum LocalizationColumnsId {
    KEY = 'key',
    VALUE = 'value',
    EN_VALUE = 'en-value',
    ACTIONS = 'actions',
}

export const getLocalizationColumns = ({
    rowSelection,
    dataArr,
    t,
    secondLanguage,
    firstLanguage,
    handleAllCheckboxChange,
    handleCheckboxChange,
    areBeingEdited,
    register,
    submit,
    onCancel,
    onEdit,
}: LocalizationColumnsProps) => {
    const columns: Array<ColumnDef<NameValueObj>> = [
        ...(rowSelection
            ? [
                  {
                      header: ({ table }: { table: ITable<NameValueObj> }) => {
                          const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))

                          return (
                              <div className="govuk-checkboxes govuk-checkboxes--small">
                                  <CheckBox
                                      label=""
                                      name="checkbox"
                                      id="checkbox-all"
                                      value="checkbox-all"
                                      onChange={(event) => {
                                          event.stopPropagation()
                                          handleAllCheckboxChange(dataArr)
                                      }}
                                      onClick={(event) => event.stopPropagation()}
                                      checked={checked}
                                      containerClassName={styles.marginBottom15}
                                      title={t('table.selectAllItems')}
                                  />
                              </div>
                          )
                      },
                      id: CHECKBOX_CELL,

                      cell: ({ row }: { row: Row<NameValueObj> }) => {
                          return (
                              <div className="govuk-checkboxes govuk-checkboxes--small" id={`checkbox_cell_${row.id}`}>
                                  <CheckBox
                                      label=""
                                      title={t('table.selectItem', { itemName: row.original.uuid })}
                                      name="checkbox"
                                      id={`checkbox_${row.id}`}
                                      value="true"
                                      onChange={(event) => {
                                          event.stopPropagation()
                                          handleCheckboxChange(row)
                                      }}
                                      onClick={(event) => event.stopPropagation()}
                                      checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
                                      containerClassName={styles.marginBottom15}
                                  />
                              </div>
                          )
                      },
                  },
              ]
            : []),
        {
            id: LocalizationColumnsId.KEY,
            header: t('localization.key'),
            accessorFn: (row) => row?.uuid ?? '',
            cell: (ctx) => {
                return ctx.getValue() ?? ''
            },
            enableSorting: true,
        },
        {
            id: LocalizationColumnsId.VALUE,
            header: t(`localization.value${firstLanguage}`),
            accessorFn: (row) => row?.value ?? '',
            cell: (ctx) => {
                if (areBeingEdited[ctx.row.original.uuid]) {
                    const name = secondLanguage ? `${getKey(ctx.row.original.uuid)}.sk` : getKey(ctx.row.original.uuid)
                    return <Input {...register(name)} />
                }
                return ctx.getValue() ?? ''
            },
            enableSorting: true,
        },
        ...(secondLanguage
            ? [
                  {
                      id: LocalizationColumnsId.EN_VALUE,
                      header: t('localization.valueEN'),
                      accessorFn: (row: NameValueObj) => (hasSecValue(row) ? row.secValue : ''),
                      cell: (ctx: CellContext<NameValueObj, unknown>) => {
                          if (areBeingEdited[ctx.row.original.uuid]) {
                              const name = `${getKey(ctx.row.original.uuid)}.en`
                              return <Input {...register(name)} />
                          }
                          return ctx.getValue() ?? ''
                      },
                      enableSorting: true,
                  },
              ]
            : []),
        {
            id: LocalizationColumnsId.ACTIONS,
            header: t(`localization.actions`),
            accessorFn: (row) => row.uuid,
            cell: (ctx) => {
                const isBeingEdited = areBeingEdited[ctx.row.original.uuid]
                if (isBeingEdited) {
                    return (
                        <ButtonPopup
                            key={ctx?.row?.original.uuid}
                            buttonLabel={t('actionsInTable.actions')}
                            popupPosition="right"
                            popupContent={(closePopup) => (
                                <div className={styles.actions}>
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            submit(ctx.row.original.uuid)
                                            closePopup()
                                        }}
                                        label={t('actionsInTable.save')}
                                    />
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            onCancel(ctx.row.original.uuid)
                                            closePopup()
                                        }}
                                        label={t('actionsInTable.cancel')}
                                    />
                                </div>
                            )}
                        />
                    )
                }
                return <Button label={t('actionsInTable.edit')} onClick={() => onEdit(ctx.row.original)} />
            },
        },
    ]

    return columns
}

type GetDataArrProps = {
    secondLanguage: SecondLanguage
    firstData: GetAll200 | undefined
    secondData: GetAll200 | undefined
    sortBy: 'SK' | 'EN'
}
export const getDataArr = ({ secondLanguage, firstData, secondData, sortBy }: GetDataArrProps) => {
    let dataArr: NameValueObj[] = []
    if (secondLanguage) {
        if (sortBy === 'EN') {
            dataArr = Object.keys(secondData ?? {})?.map((i) => ({ uuid: i, value: firstData?.[i] ?? '', secValue: secondData?.[i] ?? '' }))
        } else {
            dataArr = Object.keys(firstData ?? {})?.map((i) => ({ uuid: i, value: firstData?.[i] ?? '', secValue: secondData?.[i] ?? '' }))
        }
    } else {
        dataArr = Object.keys(firstData ?? {})?.map((i) => ({ uuid: i, value: firstData?.[i] ?? '' }))
    }
    return dataArr
}
