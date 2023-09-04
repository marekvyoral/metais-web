import { BaseModal, Button, SelectLazyLoading, TextBody } from '@isdd/idsk-ui-kit'
import { MetaAttributesState, SortBy, SortType } from '@isdd/idsk-ui-kit/src/types'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'

import styles from './selectCiItem.module.scss'

import { ATTRIBUTE_NAME, ConfigurationItemUi, IncidentRelationshipSetUi, useReadCiList1 } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'

interface Props {
    onChangeSelectedCiItem: (val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => void
    filterTypeEntityName: string
    perPage?: number
    onCloseModal: () => void
    onOpenModal: () => void
    existingRelations: IncidentRelationshipSetUi | undefined
    modalContent?: React.ReactNode
}

export const SelectCiItem: React.FC<Props> = ({
    onChangeSelectedCiItem,
    filterTypeEntityName,
    perPage = 20,
    onCloseModal,
    onOpenModal,
    modalContent,
    existingRelations,
}) => {
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSearchQuery, setSearchQuery] = useState('')
    const { selectedItems, isListPageOpen } = useNewRelationData()
    const {
        state: { user },
    } = useAuth()

    const {
        data: ciListData,
        isLoading,
        isError,
    } = useReadCiList1(
        {
            filter: {
                fullTextSearch: currentSearchQuery,
                type: [filterTypeEntityName],
                uuid: [],
                metaAttributes: {
                    state: [MetaAttributesState.DRAFT],
                },
            },
            page: currentPage,
            perpage: perPage,
            sortBy: SortBy.GEN_PROFIL_NAZOV,
            sortType: SortType.ASC,
        },
        { query: { enabled: !!user, keepPreviousData: true } },
    )

    const filteredCiListData = ciListData?.configurationItemSet?.filter(
        (item) =>
            !existingRelations?.endRelationshipSet?.map((rel) => rel.startUuid).includes(item.uuid) ||
            !existingRelations?.startRelationshipSet?.map((rel) => rel.endUuid).includes(item.uuid),
    )

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        setCurrentPage(page + 1)
        setSearchQuery(searchQuery)
        const options = filteredCiListData

        return {
            options: options || [],
            hasMore: options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }
    return (
        <>
            {isLoading && (
                <QueryFeedback
                    loading={isLoading}
                    error={false}
                    indicatorProps={{ fullscreen: true, layer: 'parent', label: t('selectCiItem.loading') }}
                />
            )}

            <div className={styles.rowDiv}>
                <div className={styles.selectDiv}>
                    <SelectLazyLoading
                        error={isError ? t('selectCiItem.error') : ''}
                        isMulti
                        getOptionLabel={(item) => item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                        getOptionValue={(item) => item.uuid ?? ''}
                        loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                        label={t('selectCiItem.label')}
                        name="select-configuration-item"
                        onChange={(val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => onChangeSelectedCiItem(val)}
                        value={selectedItems}
                    />
                </div>
                <TextBody className={classNames(styles.marginTop, styles.italic)}>alebo</TextBody>
                <Button className={styles.marginTop} variant="secondary" label={t('newRelation.pickItems')} onClick={onOpenModal} />
            </div>

            {modalContent && (
                <BaseModal isOpen={isListPageOpen} close={onCloseModal}>
                    {modalContent}
                </BaseModal>
            )}
        </>
    )
}
