import React, { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { useNavigate } from 'react-router-dom'
import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import classnames from 'classnames'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { TableSelectColumns } from '@isdd/idsk-ui-kit/table-select-columns/TableSelectColumns'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { BASE_PAGE_SIZE } from '../../api'
import { ExportItemsOrRelations } from '../export-items-or-relations/ExportItemsOrRelations'

import styles from './actionsOverTable.module.scss'

import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon, ExportIcon, ImportIcon, PlusIcon } from '@/assets/images'

export enum ActionNames {
    IMPORT = 'IMPORT',
    EXPORT = 'EXPORT',
    SELECT_COLUMN = 'SELECT_COLUMN',
    ADD_NEW_ITEM = 'ADD_NEW_ITEM',
}

export type HiddenButtons = {
    [name in ActionNames]: boolean
}

interface IActionsOverTableProps {
    pagingOptions?: { value: string; label: string; disabled?: boolean }[]
    handleFilterChange?: (filter: IFilter) => void
    entityName?: string
    createPageHref?: string
    hiddenButtons?: Partial<HiddenButtons>
}

const defaultPagingOptions = [
    { value: '100', label: '100' },
    { value: '100000', label: '1000000' },
]

export const ActionsOverTable: React.FC<IActionsOverTableProps> = ({
    pagingOptions,
    entityName,
    handleFilterChange,
    createPageHref,
    hiddenButtons,
}) => {
    const [modalOpen, setModalOpen] = useState(false)

    const { t } = useTranslation()
    const pagingSelectId = useId()
    const navigate = useNavigate()

    const openModal = () => {
        setModalOpen(true)
    }
    const onClose = () => {
        setModalOpen(false)
    }
    const onExportStart = (exportValue: string, extension: string) => {
        // eslint-disable-next-line no-console
        console.log(exportValue, extension)
    }
    return (
        <div className={styles.buttonContainer}>
            <div className={styles.buttonGroup}>
                <div className={classnames(styles.mobileOrder3, styles.buttonPopup)}>
                    <ButtonPopup
                        buttonLabel={`${t('actionOverTable.actions')} (2)`}
                        buttonClassname={styles.withoutMarginBottom}
                        popupContent={() => {
                            return (
                                <div className={styles.popupActions}>
                                    <ButtonLink
                                        className={styles.buttonLinkWithIcon}
                                        icon={<img className={styles.iconInPopup} src={CrossInACircleIcon} />}
                                        label={t('actionOverTable.invalidateItems')}
                                    />
                                    <ButtonLink
                                        className={styles.buttonLinkWithIcon}
                                        icon={<img className={styles.iconInPopup} src={CheckInACircleIcon} />}
                                        label={t('actionOverTable.validateItems')}
                                    />
                                    <ButtonLink
                                        className={styles.buttonLinkWithIcon}
                                        icon={<img className={styles.iconInPopup} src={ChangeIcon} />}
                                        label={t('actionOverTable.changeOwner')}
                                    />
                                </div>
                            )
                        }}
                    />
                </div>
                <div className={classnames(styles.buttonImportExport, styles.mobileOrder2)}>
                    {!hiddenButtons?.IMPORT && (
                        <Button
                            className={classnames(styles.withoutMarginBottom)}
                            label={
                                <div className={styles.buttonWithIcon}>
                                    <img className={styles.iconExportImport} src={ImportIcon} />
                                    <TextBody className={styles.withoutMarginBottom}>{t('actionOverTable.import')}</TextBody>
                                </div>
                            }
                            variant="secondary"
                        />
                    )}
                    {!hiddenButtons?.EXPORT && (
                        <Button
                            className={classnames(styles.withoutMarginBottom)}
                            onClick={openModal}
                            label={
                                <div className={styles.buttonWithIcon}>
                                    <img className={styles.iconExportImport} src={ExportIcon} />
                                    <TextBody className={styles.withoutMarginBottom}>{t('actionOverTable.export')}</TextBody>
                                </div>
                            }
                            variant="secondary"
                        />
                    )}
                    {hiddenButtons?.EXPORT && <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart} />}
                </div>

                {!hiddenButtons?.ADD_NEW_ITEM && (
                    <Button
                        className={classnames(styles.withoutMarginBottom, styles.mobileOrder1)}
                        onClick={() => {
                            navigate(createPageHref ?? `/ci/${entityName}/create`)
                        }}
                        label={
                            <div className={styles.buttonWithIcon}>
                                <img className={styles.iconAddItems} src={PlusIcon} />
                                {t('actionOverTable.addISVSitem')}
                            </div>
                        }
                    />
                )}
            </div>
            <div className={styles.buttonGroupSelect}>
                {!hiddenButtons?.SELECT_COLUMN && (
                    <ButtonPopup
                        buttonLabel={t('actionOverTable.selectColumn')}
                        buttonClassname={styles.withoutMarginBottom}
                        popupContent={() => {
                            return (
                                <TableSelectColumns
                                    onClose={function (): void {
                                        throw new Error('Function not implemented.')
                                    }}
                                    resetDefaultOrder={function (): void {
                                        throw new Error('Function not implemented.')
                                    }}
                                    showSelectedColumns={function (): void {
                                        throw new Error('Function not implemented.')
                                    }}
                                    columns={[
                                        { technicalName: 'Tname', name: 'name', selected: false },
                                        { technicalName: 'Tname2', name: 'name2', selected: false },
                                        { technicalName: 'Tname3', name: 'name3', selected: false },
                                        { technicalName: 'Tname4', name: 'name4', selected: false },
                                        { technicalName: 'Tname5', name: 'name5', selected: false },
                                        { technicalName: 'Tname6', name: 'name6', selected: false },
                                        { technicalName: 'Tname7', name: 'name7', selected: false },
                                        { technicalName: 'Tname8', name: 'name8', selected: false },
                                        { technicalName: 'Tname9', name: 'name9', selected: false },
                                    ]}
                                    header={'header'}
                                />
                            )
                        }}
                    />
                )}
                <SimpleSelect
                    className={styles.selectGroup}
                    label={t('actionOverTable.view')}
                    id={pagingSelectId}
                    options={pagingOptions ?? defaultPagingOptions}
                    onChange={(event) => handleFilterChange?.({ pageSize: parseInt(event?.target?.value) ?? BASE_PAGE_SIZE })}
                />
            </div>
        </div>
    )
}
