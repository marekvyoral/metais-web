import { latiniseString } from '@isdd/metais-common/src/componentHelpers/filter/feFilters'
import classNames from 'classnames'
import React, { ChangeEvent, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './tableSelectColumns.module.scss'

import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { SearchInput } from '@isdd/idsk-ui-kit/searchInput'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

export interface ISelectColumnType {
    technicalName: string
    name: string
    selected: boolean
}
export interface ISelectSectionType {
    name: string
    columns: ISelectColumnType[]
}

interface ITableSelectColumnsProps {
    onClose: () => void
    onReset: () => void
    onSave: (selectedColumns: ISelectColumnType[]) => void
    columns?: ISelectColumnType[]
    sections?: ISelectSectionType[]
    header: string
}

export interface ISectionProps {
    sectionName: string
    columns: ISelectColumnType[]
    search: string
    selectedColumns: ISelectColumnType[]
    updateSelectedValue: (key: string, checked: boolean) => void
}

const ColumnSection: React.FC<ISectionProps> = ({ sectionName, columns, search, selectedColumns, updateSelectedValue }) => {
    if (columns.length === 0) return null
    return (
        <>
            <TextBody size="S" className={classNames('govuk-!-font-weight-bold', styles.textHeader)}>
                {sectionName}
            </TextBody>
            <div className={classNames('govuk-checkboxes govuk-checkboxes--small')}>
                {columns
                    .filter((column) => latiniseString(column.name).includes(latiniseString(search)))
                    .map((column) => {
                        return (
                            <CheckBox
                                labelClassName={styles.customLabelCheckbox}
                                key={column.technicalName}
                                label={column.name}
                                id={column.technicalName}
                                name={column.technicalName}
                                value={column.technicalName}
                                checked={selectedColumns.find((i) => i.technicalName === column.technicalName)?.selected}
                                onChange={(e) => updateSelectedValue(e.target.value, e.target.checked)}
                            />
                        )
                    })}
            </div>
        </>
    )
}

const MAX_SELECTED_COLUMNS = 8

export const TableSelectColumns: React.FC<ITableSelectColumnsProps> = ({ onClose, onReset, onSave, columns, sections, header }) => {
    const { t } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState([...(columns || [])])
    // const [columnSections, setColumnSections] = useState<ISelectSectionType[]>([...(sections || [])])
    const [search, setSearch] = useState('')
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }
    const listId = useId()

    const updateSelectedValue = (key: string, checked: boolean) => {
        const selectedColumnsCount = selectedColumns.filter((column) => column.selected).length
        if (checked && selectedColumnsCount >= MAX_SELECTED_COLUMNS) {
            return
        }

        setSelectedColumns((prev) => {
            const copy = [...prev]
            const columnIndex = copy.findIndex((column) => column.technicalName === key)
            const changedColumn = copy[columnIndex]
            copy[columnIndex] = { ...changedColumn, selected: checked }
            return copy
        })
    }

    return (
        <>
            <div>
                <SearchInput
                    id="search"
                    name="search"
                    className={styles.searchbar}
                    onChange={handleChange}
                    aria-autocomplete="list"
                    aria-controls={listId}
                />
                <TextBody size="S" className={classNames('govuk-!-font-weight-bold', styles.textHeader)}>
                    {header}
                </TextBody>
                <div className={classNames('govuk-checkboxes govuk-checkboxes--small', styles.scroll)} id={listId} role="listbox">
                    {sections
                        ? sections.map((section) => (
                              <ColumnSection
                                  key={section.name}
                                  sectionName={section.name}
                                  columns={section.columns}
                                  search={search}
                                  selectedColumns={selectedColumns}
                                  updateSelectedValue={updateSelectedValue}
                              />
                          ))
                        : selectedColumns
                              .filter((column) => latiniseString(column.name).includes(latiniseString(search)))
                              .map((column) => {
                                  const { name, technicalName, selected } = column
                                  return (
                                      <CheckBox
                                          labelClassName={styles.customLabelCheckbox}
                                          key={technicalName}
                                          label={name}
                                          id={technicalName}
                                          name={technicalName}
                                          value={technicalName}
                                          checked={selected}
                                          onChange={(e) => updateSelectedValue(e.target.value, e.target.checked)}
                                      />
                                  )
                              })}
                </div>
                <div className={styles.buttonGroup}>
                    <ButtonLink
                        label={t('tableSelectColumns.refreshButton')}
                        onClick={() => {
                            onReset()
                            onClose()
                        }}
                        className={styles.resetDefaultOrderButton}
                    />
                    <ButtonLink label={t('tableSelectColumns.cancelButton')} onClick={onClose} className={styles.cancelButton} />
                    <Button
                        label={t('tableSelectColumns.viewButton')}
                        onClick={() => {
                            onSave(selectedColumns)
                            onClose()
                        }}
                        className={styles.viewButton}
                    />
                </div>
            </div>
        </>
    )
}
