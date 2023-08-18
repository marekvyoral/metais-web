import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { Button, CheckBox, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { Link } from 'react-router-dom'
import { TFunction } from 'i18next'

import { CodelistsRefs, CodelistsTableColumnsDefinition } from './CodelistsTable'
import styles from './codelistsTable.module.scss'

interface IGetCodelistsColumns {
    t: TFunction<'translation', undefined, 'translation'>
    refs: CodelistsRefs
    handleDelete: (enumCode: string) => void
    handleValidate: (enumCode: string) => void
    handleEditClick: (enumCode: string) => void
    handleSubmitForRow: (rowId: number, valid: boolean, version: string | undefined, isUpdate: boolean) => Promise<void>
    setCurrentData: React.Dispatch<React.SetStateAction<CodelistsTableColumnsDefinition[]>>
    setEditableCodes: React.Dispatch<React.SetStateAction<string[]>>
}

enum CodelistsColumnId {
    CODE = 'CODE',
    NAME = 'NAME',
    DESCRIPTION = 'DESCRIPTION',
    VALIDITY = 'VALIDITY',
    CATEGORY = 'CATEGORY',
    ACTIONS = 'ACTIONS',
}

export const getCodelistsColumns = ({
    t,
    refs,
    handleDelete,
    handleValidate,
    handleSubmitForRow,
    setCurrentData,
    setEditableCodes,
    handleEditClick,
}: IGetCodelistsColumns) => {
    const { nameRefInput, codeRefInput, categoryRefInput, descriptionRefInput } = refs

    const columns: Array<ColumnDef<CodelistsTableColumnsDefinition>> = [
        {
            accessorFn: (row) => row,
            header: t('codelists.code'),
            id: CodelistsColumnId.CODE,
            cell: (row) => {
                const rowObject = row.getValue() as CodelistsTableColumnsDefinition
                const codeError = rowObject.errors?.find((item) => item.id === rowObject.id)?.code
                if (rowObject.editableCodes.includes(rowObject.code ?? '')) {
                    return (
                        <>
                            <Input
                                label=""
                                id={rowObject.id?.toString() + CodelistsColumnId.CODE ?? ''}
                                defaultValue={rowObject.code}
                                name={rowObject.code ?? ''}
                                ref={(ref) => {
                                    if (ref != null) {
                                        const id = rowObject.id ?? -1
                                        codeRefInput.current[id] = ref
                                    }
                                }}
                                disabled={!rowObject.new}
                            />
                            {codeError && <p>{codeError}</p>}
                        </>
                    )
                }
                return <Link to={`${rowObject.code}`}>{rowObject.code}</Link>
            },
        },
        {
            accessorFn: (row) => row,
            header: t('codelists.name'),
            id: CodelistsColumnId.NAME,
            cell: (row) => {
                const rowObject = row.getValue() as CodelistsTableColumnsDefinition
                const nameError = rowObject.errors?.find((item) => item.id === rowObject.id)?.name
                if (rowObject.editableCodes.includes(rowObject.code ?? '')) {
                    return (
                        <>
                            <Input
                                label=""
                                id={rowObject.id?.toString() + CodelistsColumnId.NAME ?? ''}
                                defaultValue={rowObject.name}
                                name={rowObject.name ?? ''}
                                ref={(ref) => {
                                    if (ref != null) {
                                        const id = rowObject.id ?? -1
                                        nameRefInput.current[id] = ref
                                    }
                                }}
                                error={nameError ?? ''}
                            />
                        </>
                    )
                }
                return rowObject.name
            },
        },
        {
            accessorFn: (row) => row,
            header: t('codelists.description'),
            id: CodelistsColumnId.DESCRIPTION,
            cell: (row) => {
                const rowObject = row.getValue() as CodelistsTableColumnsDefinition
                const descriptionError = rowObject.errors?.find((item) => item.id === rowObject.id)?.description
                if (rowObject.editableCodes.includes(rowObject.code ?? '')) {
                    return (
                        <>
                            <TextArea
                                rows={3}
                                label=""
                                id={rowObject.id?.toString() + 'description' ?? ''}
                                defaultValue={rowObject.description}
                                name={rowObject.description ?? ''}
                                ref={(ref) => {
                                    if (ref != null) {
                                        const id = rowObject.id ?? -1
                                        descriptionRefInput.current[id] = ref
                                    }
                                }}
                            />
                            {descriptionError && <p>{descriptionError}</p>}
                        </>
                    )
                }
                return rowObject.description
            },
        },
        {
            accessorFn: (row) => row,
            header: t('codelists.valid'),
            id: CodelistsColumnId.VALIDITY,
            cell: (row) => {
                const rowObject = row.getValue() as CodelistsTableColumnsDefinition
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            disabled
                            label=""
                            checked={!!rowObject.valid}
                            id={rowObject.id?.toString() + 'valid' ?? ''}
                            value={rowObject.valid?.toString() ?? ''}
                            name={rowObject.code ?? ''}
                        />
                    </div>
                )
            },
        },
        {
            accessorFn: (row) => row,
            header: t('codelists.category'),
            id: CodelistsColumnId.CATEGORY,
            cell: (row) => {
                const rowObject = row.getValue() as CodelistsTableColumnsDefinition
                return (
                    <SimpleSelect
                        label=""
                        disabled={!rowObject.editableCodes.includes(rowObject.code ?? '')}
                        id={rowObject.id?.toString() + 'category' ?? ''}
                        options={[
                            { label: '-', value: '' },
                            { label: 'LICENSE', value: 'LICENSE' },
                        ]}
                        ref={(ref) => {
                            if (ref != null) {
                                const id = rowObject.id ?? -1
                                categoryRefInput.current[id] = ref
                            }
                        }}
                        defaultValue={rowObject.category}
                    />
                )
            },
        },
        {
            accessorFn: (row) => row,
            header: '',
            id: CodelistsColumnId.ACTIONS,
            cell: (row) => {
                const rowObject = row.getValue() as CodelistsTableColumnsDefinition
                if (!rowObject.valid && !rowObject.new) {
                    return <Button label={t('codelists.validate')} onClick={() => handleValidate(rowObject.code ?? '')} />
                }
                if (rowObject.new) {
                    return (
                        <div className={styles.buttonDiv}>
                            <Button
                                className={styles.buttonSpacing}
                                label={t('codelists.save')}
                                onClick={() => handleSubmitForRow(rowObject.id ?? -1, !!rowObject.valid, rowObject.version, false)}
                            />
                            <Button
                                label={t('codelists.remove')}
                                variant="secondary"
                                onClick={() => setCurrentData((prev) => prev.filter((item) => item.id !== rowObject.id))}
                            />
                        </div>
                    )
                }
                if (rowObject.editableCodes.includes(rowObject.code ?? '')) {
                    return (
                        <div className={styles.buttonDiv}>
                            <Button
                                className={styles.buttonSpacing}
                                label={t('codelists.save')}
                                onClick={() => handleSubmitForRow(rowObject.id ?? -1, !!rowObject.valid, rowObject.version, true)}
                            />
                            <Button
                                label={t('codelists.cancel')}
                                variant="secondary"
                                onClick={() => setEditableCodes((prev) => prev.filter((item) => item !== rowObject.code))}
                            />
                        </div>
                    )
                }

                return (
                    <div className={styles.buttonDiv}>
                        <Button className={styles.buttonSpacing} label={t('codelists.edit')} onClick={() => handleEditClick(rowObject.code ?? '')} />
                        <Button label={t('codelists.delete')} variant="warning" onClick={() => handleDelete(rowObject.code ?? '')} />
                    </div>
                )
            },
        },
    ]
    return columns
}
