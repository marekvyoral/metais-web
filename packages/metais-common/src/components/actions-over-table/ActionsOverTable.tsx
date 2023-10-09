import { Can } from '@casl/react'
import { ISelectColumnType, TableSelectColumns } from '@isdd/idsk-ui-kit'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/page-size-select/PageSizeSelect'
import { CiTableSelectColumns, IColumnSectionType } from '@isdd/idsk-ui-kit/src/ci-table-select-columns/CiTableSelectColumns'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import classnames from 'classnames'
import { PropsWithChildren, default as React, useId } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './actionsOverTable.module.scss'

import { Attribute, AttributeProfile, BASE_PAGE_SIZE, CiType } from '@isdd/metais-common/api'
import { notificationDefaultSelectedColumns } from '@isdd/metais-common/constants'
import { Actions, useCreateCiAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IColumn } from '@isdd/metais-common/hooks/useColumnList'

export enum ActionNames {
    SELECT_COLUMNS = 'SELECT_COLUMNS',
    PAGING = 'PAGING',
    BULK_ACTIONS = 'BULK_ACTIONS',
}

export interface ISimpleTableSelectParams {
    selectedColumns: ISelectColumnType[]
    setSelectedColumns: React.Dispatch<React.SetStateAction<ISelectColumnType[]>>
}

export type HiddenButtons = {
    [name in ActionNames]: boolean
}
interface IActionsOverTableProps extends PropsWithChildren {
    pagingOptions?: { value: string; label: string; disabled?: boolean }[]
    pageSize?: number
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
    bulkPopup?: React.ReactNode
    metaAttributesColumnSection?: IColumnSectionType
    handlePagingSelect?: (page: string) => void
    simpleTableColumnsSelect?: ISimpleTableSelectParams
}

export enum FileImportStepEnum {
    VALIDATE = 'validate',
    IMPORT = 'import',
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
}) => {
    const ability = useCreateCiAbility(ciTypeData, entityName)
    const { t } = useTranslation()
    const pagingSelectId = useId()

    const attributeProfilesColumnSections: IColumnSectionType[] =
        attributeProfiles?.map((attributeProfile) => ({
            name: attributeProfile.name || '',
            attributes:
                attributeProfile.attributes
                    ?.filter((attribute) => attribute.invisible === false)
                    .map((attribute) => ({
                        name: attribute.name || '',
                        technicalName: attribute.technicalName || '',
                    })) || [],
        })) ?? []

    const attributesColumnSection: IColumnSectionType = {
        name: entityName || '',
        attributes:
            attributes
                ?.filter((attribute) => attribute.invisible === false)
                ?.map((attribute) => ({
                    name: attribute.name || '',
                    technicalName: attribute.technicalName || '',
                })) ?? [],
    }

    const defaultHandlePagingSelect = (page: string) => {
        handleFilterChange?.({ pageSize: parseInt(page) ?? BASE_PAGE_SIZE })
    }

    return (
        <div className={styles.buttonContainer}>
            <div className={styles.buttonGroup}>
                {children}
                {bulkPopup && !hiddenButtons?.BULK_ACTIONS && (
                    <Can I={Actions.BULK_ACTIONS} a={'ci'} ability={ability}>
                        <>{bulkPopup}</>
                    </Can>
                )}
                <div className={classnames(styles.buttonImportExport, styles.mobileOrder2)}>
                    {importButton && (
                        <Can I={Actions.IMPORT} a={'ci'} ability={ability}>
                            <>{importButton}</>
                        </Can>
                    )}
                    {exportButton && (
                        <Can I={Actions.EXPORT} a={'ci'} ability={ability}>
                            <>{exportButton}</>
                        </Can>
                    )}
                </div>
                {createButton && (
                    <Can I={Actions.CREATE} a={'ci'} ability={ability}>
                        <>{createButton}</>
                    </Can>
                )}
            </div>

            <div className={styles.buttonGroupSelect}>
                {!hiddenButtons?.SELECT_COLUMNS && (
                    <Can I={Actions.SELECT_COLUMNS} a={'ci'} ability={ability}>
                        <ButtonPopup
                            buttonLabel={t('actionOverTable.selectColumn')}
                            buttonClassName="marginBottom0"
                            popupContent={(closePopup) => {
                                return simpleTableColumnsSelect ? (
                                    <TableSelectColumns
                                        onClose={closePopup}
                                        resetDefaultOrder={() => simpleTableColumnsSelect.setSelectedColumns(notificationDefaultSelectedColumns)}
                                        showSelectedColumns={simpleTableColumnsSelect.setSelectedColumns}
                                        columns={simpleTableColumnsSelect.selectedColumns}
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
                    </Can>
                )}
                {!hiddenButtons?.PAGING && (
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
