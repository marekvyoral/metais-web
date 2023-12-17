import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { getRefRegsDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, CreateEntityButton, QueryFeedback, Reference_Registers, distinctAttributesMetaAttributes } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { RefRegistersFilter } from './RefRegistersFilter'

import { CiTable } from '@/components/ci-table/CiTable'
import { RefRegisterListContainerView } from '@/components/containers/refregisters/RefRegisterListContainer'

export const RefRegisterListView = ({
    data: { referenceRegisters, columnListData, guiAttributes, unitsData, ciTypeData, constraintsData, attributeProfiles, renamedAttributes },
    defaultFilterValues,
    pagination,
    saveColumnSelection,
    resetColumns,
    sort,
    handleFilterChange,
    isLoading,
    isError,
}: RefRegisterListContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <TextHeading size="XL">{t('refRegisters.title')}</TextHeading>
            <RefRegistersFilter defaultFilterValues={defaultFilterValues} />
            <ActionsOverTable
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={Reference_Registers}
                createButton={
                    <CreateEntityButton
                        label={t('refRegisters.createBtn')}
                        onClick={() => navigate(`/refregisters/create`, { state: { from: location } })}
                    />
                }
                attributeProfiles={attributeProfiles}
                attributes={[...distinctAttributesMetaAttributes(renamedAttributes ?? [], getRefRegsDefaultMetaAttributes(t)), ...guiAttributes]}
                columnListData={columnListData}
                metaAttributesColumnSection={getRefRegsDefaultMetaAttributes(t)}
                storeUserSelectedColumns={saveColumnSelection}
                resetUserSelectedColumns={resetColumns}
            />
            <CiTable
                data={{
                    columnListData,
                    tableData: {
                        configurationItemSet: referenceRegisters?.map((refReg) => ({
                            attributes: { ...refReg },
                            uuid: refReg?.uuid,
                        })),
                    },
                    constraintsData,
                    unitsData,
                    entityStructure: { ...ciTypeData, attributes: [...(renamedAttributes ?? []), ...guiAttributes] },
                    gestorsData: undefined,
                }}
                handleFilterChange={handleFilterChange}
                pagination={pagination}
                sort={sort}
                isLoading={isLoading}
                isError={isError}
            />
        </QueryFeedback>
    )
}
