import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import classnames from 'classnames'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { IColumnSectionType, TableSelectColumns } from '@isdd/idsk-ui-kit/table-select-columns/TableSelectColumns'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import styles from './actionsOverTable.module.scss'

import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Attribute, AttributeProfile, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { IColumn } from '@isdd/metais-common/hooks/useColumnList'

export enum ActionNames {
    SELECT_COLUMNS = 'SELECT_COLUMNS',
    PAGING = 'PAGING',
}

export type HiddenButtons = {
    [name in ActionNames]: boolean
}

interface IActionsOverTableProps {
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
    createButton?: React.ReactNode
    exportButton?: React.ReactNode
    importButton?: React.ReactNode
    bulkPopup?: React.ReactNode
    metaAttributesColumnSection?: IColumnSectionType
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
    hiddenButtons,
    createButton,
    exportButton,
    importButton,
    bulkPopup,
}) => {
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

    return (
        <div className={styles.buttonContainer}>
            <div className={styles.buttonGroup}>
                {bulkPopup && <>{bulkPopup}</>}
                <div className={classnames(styles.buttonImportExport, styles.mobileOrder2)}>
                    {importButton && <>{importButton}</>}
                    {exportButton && <>{exportButton}</>}
                </div>
                {createButton && <>{createButton}</>}
            </div>
            <div className={styles.buttonGroupSelect}>
                {!hiddenButtons?.SELECT_COLUMNS && (
                    <ButtonPopup
                        buttonLabel={t('actionOverTable.selectColumn')}
                        buttonClassName="marginBottom0"
                        popupContent={(closePopup) => {
                            return (
                                <TableSelectColumns
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
                {!hiddenButtons?.PAGING && (
                    <SimpleSelect
                        className={styles.selectGroup}
                        label={t('actionOverTable.view')}
                        id={pagingSelectId}
                        options={pagingOptions ?? DEFAULT_PAGESIZE_OPTIONS}
                        onChange={(event) => handleFilterChange?.({ pageSize: parseInt(event?.target?.value) ?? BASE_PAGE_SIZE })}
                    />
                )}
            </div>
        </div>
    )
}
