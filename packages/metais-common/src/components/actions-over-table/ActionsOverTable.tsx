import { Can } from '@casl/react'
import { ISelectColumnType, ISelectSectionType, TableSelectColumns } from '@isdd/idsk-ui-kit'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/page-size-select/PageSizeSelect'
import { CiTableSelectColumns, IColumnSectionType } from '@isdd/idsk-ui-kit/src/ci-table-select-columns/CiTableSelectColumns'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import classnames from 'classnames'
import { PropsWithChildren, default as React, useId } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './actionsOverTable.module.scss'
import { SelectedRowsAriaRead } from './selected-rows-aria-read/SelectedRowsAriaRead'

import { Attribute, AttributeProfile, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Actions, useCreateCiAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IColumn } from '@isdd/metais-common/hooks/useColumnList'

export enum ActionNames {
    SELECT_COLUMNS = 'SELECT_COLUMNS',
    PAGING = 'PAGING',
    BULK_ACTIONS = 'BULK_ACTIONS',
}

export interface ISimpleTableSelectParams {
    sections?: ISelectSectionType[]
    selectedColumns?: ISelectColumnType[]
    saveSelectedColumns: (columns: ISelectColumnType[]) => void
    resetSelectedColumns: () => void
}

export type HiddenButtons = {
    [name in ActionNames]: boolean
}
interface IActionsOverTableProps extends PropsWithChildren {
    pagingOptions?: { value: string; label: string; disabled?: boolean }[]
    handleFilterChange?: (filter: IFilter) => void
    entityName: string
    storeUserSelectedColumns?: (columnSelection: {
        attributes: { name: string; order: number }[]
        metaAttributes: { name: string; order: number }[]
    }) => void
    resetUserSelectedColumns?: () => Promise<void>
    attributeProfiles?: AttributeProfile[]
    columnListData?: IColumn | undefined
    attributes?: Attribute[]
    hiddenButtons?: Partial<HiddenButtons>
    createHref?: string
    ciTypeData?: CiType
    createButton?: React.ReactNode
    exportButton?: React.ReactNode
    importButton?: React.ReactNode
    bulkPopup?: (params: { selectedRowsCount?: number }) => React.ReactNode
    metaAttributesColumnSection?: IColumnSectionType
    handlePagingSelect?: (page: string) => void
    simpleTableColumnsSelect?: ISimpleTableSelectParams
    pagination: Pagination
    selectedRowsCount?: number
}

export enum FileImportStepEnum {
    VALIDATE = 'validate',
    IMPORT = 'import',
    DONE = 'done',
}

export const ActionsOverTable: React.FC<IActionsOverTableProps> = ({
    pagingOptions,
    entityName,
    handleFilterChange,
    resetUserSelectedColumns,
    storeUserSelectedColumns,
    attributeProfiles,
    columnListData,
    metaAttributesColumnSection,
    attributes,
    ciTypeData,
    hiddenButtons,
    createButton,
    exportButton,
    importButton,
    bulkPopup,
    handlePagingSelect,
    simpleTableColumnsSelect,
    children,
    pagination,
    selectedRowsCount,
}) => {
    const ability = useCreateCiAbility(ciTypeData, entityName)
    const { t } = useTranslation()
    const pagingSelectId = useId()

    const attributeProfilesColumnSections: IColumnSectionType[] =
        attributeProfiles?.map((attributeProfile) => ({
            name: attributeProfile.name || '',
            attributes:
                attributeProfile.attributes
                    ?.filter((attribute) => attribute.invisible === false && attribute.valid)
                    .map((attribute) => ({
                        name: attribute.name || '',
                        technicalName: attribute.technicalName || '',
                    })) || [],
        })) ?? []

    const attributesColumnSection: IColumnSectionType = {
        name: entityName || '',
        attributes:
            attributes
                ?.filter((attribute) => attribute.invisible === false && attribute.valid)
                ?.map((attribute) => ({
                    name: attribute.name || '',
                    technicalName: attribute.technicalName || '',
                })) ?? [],
    }

    const defaultHandlePagingSelect = (page: string) => {
        const parsedNewPageSize = parseInt(page)

        if (pagination.pageNumber * parsedNewPageSize - parsedNewPageSize > pagination.dataLength) {
            handleFilterChange?.({ pageSize: parsedNewPageSize, pageNumber: 1 })
        } else {
            handleFilterChange?.({ pageSize: parsedNewPageSize })
        }
    }

    return (
        <div className={styles.buttonContainer}>
            <div className={styles.buttonGroup}>
                {children}
                {bulkPopup && !hiddenButtons?.BULK_ACTIONS && (
                    <Can I={Actions.BULK_ACTIONS} a={entityName} ability={ability}>
                        <>
                            {selectedRowsCount != undefined && <SelectedRowsAriaRead count={selectedRowsCount} />}
                            {bulkPopup({ selectedRowsCount })}
                        </>
                    </Can>
                )}
                <div className={classnames(styles.buttonImportExport, styles.mobileOrder2)}>
                    {importButton && (
                        <Can I={Actions.IMPORT} a={entityName} ability={ability}>
                            <>{importButton}</>
                        </Can>
                    )}
                    {exportButton && <>{exportButton}</>}
                </div>
                {createButton && (
                    <Can I={Actions.CREATE} a={entityName} ability={ability}>
                        <>{createButton}</>
                    </Can>
                )}
            </div>

            <div className={styles.buttonGroupSelect}>
                {!hiddenButtons?.SELECT_COLUMNS && (
                    <ButtonPopup
                        buttonLabel={t('actionOverTable.selectColumn')}
                        buttonClassName="marginBottom0"
                        popupPosition="right"
                        popupContent={(closePopup) => {
                            return simpleTableColumnsSelect ? (
                                <TableSelectColumns
                                    onClose={closePopup}
                                    onReset={simpleTableColumnsSelect.resetSelectedColumns}
                                    onSave={simpleTableColumnsSelect.saveSelectedColumns}
                                    columns={simpleTableColumnsSelect.selectedColumns}
                                    sections={simpleTableColumnsSelect.sections}
                                    header={t('notifications.column')}
                                />
                            ) : (
                                <CiTableSelectColumns
                                    onClose={closePopup}
                                    resetDefaultOrder={resetUserSelectedColumns}
                                    showSelectedColumns={storeUserSelectedColumns}
                                    attributeProfilesColumnSections={attributeProfilesColumnSections}
                                    columnListData={columnListData}
                                    attributesColumnSection={attributesColumnSection}
                                    metaAttributesColumnSection={metaAttributesColumnSection}
                                />
                            )
                        }}
                    />
                )}
                {!hiddenButtons?.PAGING && pagingOptions && (
                    <PageSizeSelect
                        id={pagingSelectId}
                        pagingOptions={pagingOptions}
                        handlePagingSelect={handlePagingSelect ? handlePagingSelect : defaultHandlePagingSelect}
                        className={styles.selectGroup}
                    />
                )}
            </div>
        </div>
    )
}
