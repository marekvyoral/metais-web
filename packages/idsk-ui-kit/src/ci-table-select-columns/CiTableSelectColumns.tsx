import { ATTRIBUTE_NAME } from '@isdd/metais-common/src/api'
import classNames from 'classnames'
import React, { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'

import styles from './ciTableSelectColumns.module.scss'

import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { SearchInput } from '@isdd/idsk-ui-kit/searchInput'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

export interface IColumnType {
    technicalName: string
    name: string
}

interface Attribute {
    name?: string
    order?: number
}

export interface MetaAttribute {
    name?: string
    order?: number
}

export interface IColumn {
    id?: number
    ciType?: string
    attributes?: Attribute[]
    metaAttributes?: MetaAttribute[]
}

export interface IColumnSectionType {
    name: string
    attributes: IColumnType[]
}

export interface IColumnSectionProps {
    sectionName: string
    columns: IColumnType[]
    updateSelectedValue: (key: string, checked: boolean) => void
    getIsColumnChecked: (columnName: string) => boolean
}

const ColumnSection: React.FC<IColumnSectionProps> = ({ sectionName, columns, updateSelectedValue, getIsColumnChecked }) => {
    if (columns.length === 0) return null
    return (
        <>
            <TextBody size="S" className={classNames('govuk-!-font-weight-bold', styles.textHeader)}>
                {sectionName}
            </TextBody>
            <div className={classNames('govuk-checkboxes govuk-checkboxes--small')}>
                {columns.map((column) => {
                    return (
                        <CheckBox
                            labelClassName={styles.customLabelCheckbox}
                            key={column.technicalName}
                            label={column.name}
                            id={column.technicalName}
                            name={column.technicalName}
                            value={column.technicalName}
                            checked={getIsColumnChecked(column.technicalName)}
                            onChange={(e) => updateSelectedValue(e.target.value, e.target.checked)}
                            disabled={column.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov}
                        />
                    )
                })}
            </div>
        </>
    )
}

interface ICiTableSelectColumnsProps {
    onClose: () => void
    resetDefaultOrder?: () => Promise<void>
    showSelectedColumns?: (columnSelection: {
        attributes: { name: string; order: number }[]
        metaAttributes: { name: string; order: number }[]
    }) => void
    attributeProfilesColumnSections?: IColumnSectionType[]
    columnListData?: IColumn | undefined
    attributesColumnSection?: IColumnSectionType
    metaAttributesColumnSection?: IColumnSectionType
}

// const MAX_SELECTED_COLUMNS = 8

export const CiTableSelectColumns: React.FC<ICiTableSelectColumnsProps> = ({
    onClose,
    resetDefaultOrder,
    showSelectedColumns,
    columnListData,
    attributeProfilesColumnSections,
    attributesColumnSection,
    metaAttributesColumnSection,
}) => {
    const { t } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState<Attribute[]>(columnListData?.attributes || [])
    const [selectedMetaColumns, setSelectedMetaColumns] = useState<Attribute[]>(columnListData?.metaAttributes || [])
    const saveSelection = () => {
        showSelectedColumns?.({
            attributes: selectedColumns.map((x) => ({ name: x.name || '', order: x.order || 1 })),
            metaAttributes: selectedMetaColumns.map((x) => ({ name: x.name || '', order: x.order || 1 })),
        })
    }

    const updateSelectedValue = (key: string, checked: boolean) => {
        // if (checked && selectedColumns?.length >= MAX_SELECTED_COLUMNS) {
        //     return
        // }
        setSelectedColumns((prev) => {
            const selectedPrev = prev.filter((column) => column.name !== key)
            if (checked) {
                return [...selectedPrev, { name: key, order: prev.length + 1 }]
            }
            return selectedPrev
        })
    }

    const updateMetaSelectedValue = (key: string, checked: boolean) => {
        setSelectedMetaColumns((prev) => {
            const selectedPrev = prev.filter((column) => column.name !== key)
            if (checked) {
                return [...selectedPrev, { name: key, order: prev.length + 1 }]
            }
            return selectedPrev
        })
    }

    const getIsColumnChecked = (columnName: string) => {
        return selectedColumns.some((attr) => columnName === attr.name)
    }

    const getIsMetaColumnChecked = (columnName: string) => {
        return selectedMetaColumns.some((attr) => columnName === attr.name)
    }

    const [search, setSearch] = useState('')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const filterColumnsByNameSearch = (columns: IColumnType[]): IColumnType[] => {
        return columns.filter((column) => latiniseString(column.name).includes(latiniseString(search)))
    }

    return (
        <>
            <div>
                <SearchInput id="search" name="search" className={styles.searchbar} onChange={handleChange} />
                <div className={styles.scroll}>
                    <ColumnSection
                        sectionName={attributesColumnSection?.name ?? ''}
                        columns={filterColumnsByNameSearch(attributesColumnSection?.attributes ?? [])}
                        updateSelectedValue={updateSelectedValue}
                        getIsColumnChecked={getIsColumnChecked}
                    />

                    {attributeProfilesColumnSections?.map((section) => {
                        const filteredAttributes = filterColumnsByNameSearch(section.attributes)
                        return (
                            <ColumnSection
                                key={section.name}
                                sectionName={section.name}
                                columns={filteredAttributes}
                                updateSelectedValue={updateSelectedValue}
                                getIsColumnChecked={getIsColumnChecked}
                            />
                        )
                    })}
                    <ColumnSection
                        sectionName={metaAttributesColumnSection?.name ?? ''}
                        columns={filterColumnsByNameSearch(metaAttributesColumnSection?.attributes ?? [])}
                        updateSelectedValue={updateMetaSelectedValue}
                        getIsColumnChecked={getIsMetaColumnChecked}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <ButtonLink
                        label={t('tableSelectColumns.refreshButton')}
                        onClick={() => {
                            resetDefaultOrder?.()
                            onClose()
                        }}
                        className={styles.resetDefaultOrderButton}
                    />
                    <ButtonLink label={t('tableSelectColumns.cancelButton')} onClick={onClose} className={styles.cancelButton} />
                    <Button
                        label={t('tableSelectColumns.viewButton')}
                        onClick={() => {
                            saveSelection()
                            onClose()
                        }}
                        className={styles.viewButton}
                    />
                </div>
            </div>
        </>
    )
}
