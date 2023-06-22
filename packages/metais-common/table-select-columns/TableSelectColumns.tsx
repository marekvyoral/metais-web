import React, { useState } from 'react'
import classNames from 'classnames'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { useTranslation } from 'react-i18next'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { SearchInput } from '@isdd/idsk-ui-kit/searchInput'

import styles from './tableSelectColumns.module.scss'

interface IColumnType {
    technicalName: string
    name: string
    selected: boolean
}

interface ITableSelectColumnsProps {
    onClose: () => void
    resetDefaultOrder: () => void
    showSelectedColumns: (selectedColumns: IColumnType[]) => void
    columns: IColumnType[]
    header: string
}

const MAX_SELECTED_COLUMNS = 8

export const TableSelectColumns: React.FC<ITableSelectColumnsProps> = ({ onClose, resetDefaultOrder, showSelectedColumns, columns, header }) => {
    const { t } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState([...columns])
    const [search, setSearch] = useState('')

    const handleChange = (value: string) => {
        setSearch(value)
    }

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
                <SearchInput id="search" name="search" className={styles.searchbar} onChange={handleChange} />
                <TextBody size="S" className={classNames('govuk-!-font-weight-bold', styles.textHeader)}>
                    {header}
                </TextBody>
                <div className={classNames('govuk-checkboxes govuk-checkboxes--small', styles.scroll)}>
                    {selectedColumns
                        .filter((column) => column.name.includes(search))
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
                            resetDefaultOrder()
                            onClose()
                        }}
                        className={styles.resetDefaultOrderButton}
                    />
                    <ButtonLink label={t('tableSelectColumns.cancelButton')} onClick={onClose} className={styles.cancelButton} />
                    <Button
                        label={t('tableSelectColumns.viewButton')}
                        onClick={() => {
                            showSelectedColumns(selectedColumns)
                            onClose()
                        }}
                        className={styles.viewButton}
                    />
                </div>
            </div>
        </>
    )
}
