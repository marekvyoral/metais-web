import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IColumn, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemSetUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { CreateEntityButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { DEFAULT_PAGESIZE_OPTIONS, KRIScolumnsTechNames, PO } from '@isdd/metais-common/constants'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { Languages } from '@isdd/metais-common/localization/languages'
import { CiType, AttributeProfile, Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { formatAttributeOperatorString } from '@isdd/metais-common/componentHelpers/filter/formatAttirbuteOperatorString'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { isObjectEmpty } from '@isdd/metais-common/utils/utils'

import { KrisTable } from './KrisTable'

import { IStoreColumnSelection } from '@/componentHelpers/ci/ciTableHelpers'
import { KRISFilterType } from '@/pages/ci/KRIS'

interface IKrisListView {
    defaultFilterValues: KRISFilterType
    ciType: string | undefined
    columnListData: IColumn | undefined
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: IStoreColumnSelection) => void
    resetUserSelectedColumns: () => Promise<void>
    refetch: () => void
    ciTypeData: CiType | undefined
    attributeProfiles: AttributeProfile[] | undefined
    attributes: Attribute[] | undefined
    tableData: ConfigurationItemSetUi | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    gestorsData: RoleParticipantUI[] | undefined
}

export const KrisListView: React.FC<IKrisListView> = ({
    defaultFilterValues,
    ciType,
    columnListData,
    handleFilterChange,
    ciTypeData,
    attributeProfiles,
    attributes,
    tableData,
    constraintsData,
    unitsData,
    pagination,
    sort,
    gestorsData,
    isLoading,
    isError,
}) => {
    const { t, i18n } = useTranslation()

    const navigate = useNavigate()
    const location = useLocation()

    const krisStateAttribute = attributeProfiles
        ?.flatMap((profile) => profile.attributes)
        .find((att) => att?.technicalName === ATTRIBUTE_NAME.Profil_KRIS_stav_kris)
    const kristStateAttributeName = i18n.language === Languages.SLOVAK ? krisStateAttribute?.name ?? '' : krisStateAttribute?.engName ?? ''
    const krisStateFilterOptions =
        constraintsData
            .find((item) => item?.code === 'STAV_KRIS')
            ?.enumItems?.filter((item) => item.valid)
            .map((item) => ({
                label: i18n.language == Languages.SLOVAK ? item.value ?? '' : item.engValue ?? '',
                value: item.code ?? '',
            })) ?? []

    const attributesForFilter = KRIScolumnsTechNames.map((techName) => attributes?.find((att) => att.technicalName === techName) ?? {}).filter(
        (item) => !isObjectEmpty(item),
    )

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('KRIS.heading')}</TextHeading>
                {isError && <QueryFeedback loading={false} error errorProps={{ errorMessage: t('feedback.failedFetch') }} />}
            </FlexColumnReverseWrapper>

            <Filter<KRISFilterType>
                defaultFilterValues={defaultFilterValues}
                form={({ filter, setValue }) => {
                    const ownerInputName = formatAttributeOperatorString(MetainformationColumns.OWNER, OPERATOR_OPTIONS_URL.FULLTEXT)
                    const defaultValuesAsUuids = filter.metaAttributeFilters?.liableEntity?.map((item) => item ?? '') ?? []

                    return (
                        <div>
                            <SelectPOForFilter
                                isMulti={false}
                                ciType={PO}
                                label={t('KRIS.responsibleAuthority')}
                                name="owner"
                                valuesAsUuids={defaultValuesAsUuids}
                                onChange={(val) =>
                                    setValue(
                                        ownerInputName,
                                        val?.map((v) => v?.uuid ?? ''),
                                    )
                                }
                            />
                            <SimpleSelect
                                name={ATTRIBUTE_NAME.Profil_KRIS_stav_kris}
                                defaultValue={filter?.[ATTRIBUTE_NAME.Profil_KRIS_stav_kris]}
                                options={krisStateFilterOptions}
                                label={kristStateAttributeName}
                                setValue={setValue}
                            />
                            <DynamicFilterAttributes
                                setValue={setValue}
                                defaults={defaultFilterValues}
                                filterData={{
                                    attributeFilters: filter.attributeFilters ?? {},
                                    metaAttributeFilters: filter.metaAttributeFilters ?? {},
                                }}
                                attributes={attributesForFilter}
                                attributeProfiles={[]}
                                constraintsData={constraintsData}
                                ignoreInputNames={[MetainformationColumns.OWNER, MetainformationColumns.CREATED_AT, MetainformationColumns.STATE]}
                            />
                        </div>
                    )
                }}
            />

            <ActionsOverTable
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={ciTypeData?.name ?? ''}
                ciTypeData={ciTypeData}
                createButton={
                    <CreateEntityButton
                        ciTypeName={i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}
                        onClick={() => navigate(`/ci/${ciType}/create`, { state: { from: location } })}
                    />
                }
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />

            <KrisTable
                data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData, gestorsData }}
                handleFilterChange={handleFilterChange}
                pagination={pagination}
                sort={sort}
                isLoading={isLoading}
                isError={isError}
            />
        </QueryFeedback>
    )
}
