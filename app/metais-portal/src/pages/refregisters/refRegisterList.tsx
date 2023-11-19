import { ActionsOverTable, CreateEntityButton, Reference_Registers, distinctAttributesMetaAttributes } from '@isdd/metais-common'
import { getRefRegsDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { DEFAULT_PAGESIZE_OPTIONS, REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { CiTable } from '@/components/ci-table/CiTable'
import { RefRegisterListContainer } from '@/components/containers/refregisters/RefRegisterListContainer'
import { RefRegistersFilter } from '@/components/views/refregisters/RefRegistersFilter'
import { RefRegisterFilter } from '@/types/filters'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const ReferenceRegisters = () => {
    const { t } = useTranslation()
    const defaultFilterValues: RefRegisterFilter = { isvsUuid: '', managerUuid: '', registratorUuid: '', state: undefined, muk: undefined }
    const navigate = useNavigate()
    const location = useLocation()
    const entityName = REFERENCE_REGISTER
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                ]}
            />
            <MainContentWrapper>
                <AttributesContainer
                    entityName={entityName}
                    View={({ data: { attributeProfiles, constraintsData, unitsData, ciTypeData, renamedAttributes } }) => (
                        <RefRegisterListContainer<RefRegisterFilter>
                            defaultFilterValues={defaultFilterValues}
                            View={({
                                handleFilterChange,
                                data: { columnListData, referenceRegisters, guiAttributes },
                                saveColumnSelection,
                                resetColumns,
                                pagination,
                                sort,
                                isLoading,
                                isError,
                            }) => (
                                <>
                                    <TextHeading size="XL">{t('refRegisters.title')}</TextHeading>
                                    <RefRegistersFilter defaultFilterValues={defaultFilterValues} />
                                    <ActionsOverTable
                                        pagination={pagination}
                                        handleFilterChange={handleFilterChange}
                                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                        entityName={Reference_Registers}
                                        createButton={
                                            <CreateEntityButton onClick={() => navigate(`/refregisters/create`, { state: { from: location } })} />
                                        }
                                        attributeProfiles={attributeProfiles}
                                        attributes={[
                                            ...distinctAttributesMetaAttributes(renamedAttributes ?? [], getRefRegsDefaultMetaAttributes(t)),
                                            ...guiAttributes,
                                        ]}
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
                                </>
                            )}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default ReferenceRegisters
