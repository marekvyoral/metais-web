import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { IColumnSectionType, TableSelectColumns } from '@isdd/idsk-ui-kit/table-select-columns/TableSelectColumns'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { Can } from '@casl/react'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/page-size-select/PageSizeSelect'

import styles from './actionsOverTable.module.scss'

import { Attribute, AttributeProfile, BASE_PAGE_SIZE, CiType } from '@isdd/metais-common/api'
import { IColumn } from '@isdd/metais-common/hooks/useColumnList'
import { useCreateCiAbility } from '@isdd/metais-common/hooks/useUserAbility'

export enum ActionNames {
    SELECT_COLUMNS = 'SELECT_COLUMNS',
    PAGING = 'PAGING',
}

export type HiddenButtons = {
    [name in ActionNames]: boolean
}
interface IActionsOverTableProps {
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
}) => {
    const ability = useCreateCiAbility(ciTypeData)
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
                {bulkPopup && <>{bulkPopup}</>}
                <div className={classnames(styles.buttonImportExport, styles.mobileOrder2)}>
                    {importButton && (
                        <Can I={'import'} a={'ci'} ability={ability}>
                            <>{importButton}</>
                        </Can>
                    )}
                    {exportButton && (
                        <Can I={'export'} a={'ci'} ability={ability}>
                            <>{exportButton}</>
                        </Can>
                    )}
                </div>
                {createButton && (
                    <Can I={'create'} a={'ci'} ability={ability}>
                        <>{createButton}</>
                    </Can>
                )}
            </div>
            <div className={styles.buttonGroupSelect}>
                {!hiddenButtons?.SELECT_COLUMNS && (
                    <Can I={'selectColumns'} a={'ci'} ability={ability}>
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
