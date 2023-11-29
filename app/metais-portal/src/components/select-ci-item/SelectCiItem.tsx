import { BaseModal, Button, SelectLazyLoading, TextBody } from '@isdd/idsk-ui-kit'
import { MetaAttributesState, SortBy, SortType } from '@isdd/idsk-ui-kit/src/types'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi, IncidentRelationshipSetUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'

import styles from './selectCiItem.module.scss'

import { CiListPageForModal } from '@/components/ciListPageForModal/CiListPageForModal'

interface Props {
    onChangeSelectedCiItem: (val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => void
    selectedItems: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null
    perPage?: number
    onCloseModal: () => void
    onOpenModal: () => void
    existingRelations: IncidentRelationshipSetUi | undefined
    label?: string
    isOpen: boolean
    ciType: string
    error?: string
}

export const SelectCiItem: React.FC<Props> = ({
    onChangeSelectedCiItem,
    perPage = 20,
    onCloseModal,
    onOpenModal,
    existingRelations,
    label,
    isOpen,
    selectedItems,
    ciType,
    error,
}) => {
    const { t } = useTranslation()
    const readCiListFetch = useReadCiList1Hook()

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1

        const response = await readCiListFetch({
            filter: {
                fullTextSearch: searchQuery,
                type: [ciType],
                uuid: [],
                metaAttributes: {
                    state: [MetaAttributesState.DRAFT],
                },
            },
            page: page,
            perpage: perPage,
            sortBy: SortBy.GEN_PROFIL_NAZOV,
            sortType: SortType.ASC,
        })

        const filteredCiListData = response.configurationItemSet?.filter(
            (item) =>
                !existingRelations?.endRelationshipSet?.map((rel) => rel.startUuid).includes(item.uuid) ||
                !existingRelations?.startRelationshipSet?.map((rel) => rel.endUuid).includes(item.uuid),
        )

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
            <div className={styles.rowDiv}>
                <div className={styles.selectDiv}>
                    <SelectLazyLoading
                        error={error}
                        isMulti
                        getOptionLabel={(item) => item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                        getOptionValue={(item) => item.uuid ?? ''}
                        loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                        label={label ? label : t('selectCiItem.label')}
                        name="select-configuration-item"
                        onChange={(val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => onChangeSelectedCiItem(val)}
                        value={selectedItems}
                    />
                </div>
                <TextBody className={classNames(styles.marginTop, styles.italic)}>alebo</TextBody>
                <Button className={styles.marginTop} variant="secondary" label={t('newRelation.pickItems')} onClick={onOpenModal} />
            </div>

            <BaseModal isOpen={isOpen} close={onCloseModal}>
                <CiListPageForModal
                    ciType={ciType}
                    selectedItems={selectedItems}
                    onSelectedSubmit={(val) => onChangeSelectedCiItem(val)}
                    closeOnClick={onCloseModal}
                />
            </BaseModal>
        </>
    )
}
