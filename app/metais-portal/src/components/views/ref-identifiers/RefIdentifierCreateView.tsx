import { BreadCrumbs, HomeIcon, IOption, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { MutationFeedback, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Group } from '@isdd/metais-common/contexts/auth/authContext'
import { ApiError } from '@isdd/metais-common/api/generated/iam-swagger'

import { RefCatalogForm } from './forms/RefCatalogForm'
import { refIdentifierTypeOptions } from './refIdentifierListProps'
import { RefCatalogFormType } from './forms/refCreateSchema'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export const REF_PORTAL_SUBMIT_ID = 'ref_form_submit_id'

export interface RefIdentifierCreateViewPropsType {
    ciItemData?: ConfigurationItemUi
    attributes: Attribute[] | undefined
    type?: RefIdentifierTypeEnum
    groupData: Group[]
    setType?: (type: RefIdentifierTypeEnum) => void
    ciTypeData: CiType | undefined
    generatedEntityId: CiCode | undefined
    ownerId?: string
    ownerOptions: IOption<string>[]
    datasetOptions: IOption<string>[]
    defaultDatasets?: string[]
    defaultPo?: string
    updateCiItemId?: string
    wrapperRef: React.RefObject<HTMLTableSectionElement>
    handleCatalogSubmit: (formData: RefCatalogFormType) => void
    isUpdate: boolean
    isLoading: boolean
    isError: boolean
    isRedirectError: boolean
    isProcessedError: boolean
    isRedirectLoading: boolean
    isTooManyFetchesError: boolean
    isStoreError: ApiError | null
}

export const RefIdentifierCreateView: React.FC<RefIdentifierCreateViewPropsType> = ({
    ciItemData,
    attributes,
    ownerOptions,
    datasetOptions,
    defaultDatasets,
    defaultPo,
    type,
    setType,
    handleCatalogSubmit,
    wrapperRef,
    isUpdate,
    isError,
    isLoading,
    isProcessedError,
    isRedirectError,
    isRedirectLoading,
    isStoreError,
    isTooManyFetchesError,
}) => {
    const { t } = useTranslation()

    const sections: ISection[] =
        [
            {
                title: t('refIdentifiers.create.refTypeTitle'),
                error: false,
                isOpen: true,
                stepLabel: { label: '1', variant: 'circle' },
                content: (
                    <>
                        <SimpleSelect
                            label={t('refIdentifiers.create.chooseType')}
                            options={refIdentifierTypeOptions(t)}
                            required
                            disabled={isUpdate}
                            value={type}
                            onChange={(newValue) => setType && setType(newValue as RefIdentifierTypeEnum)}
                            isClearable={false}
                            defaultValue={RefIdentifierTypeEnum.DatovyPrvok}
                            name="state"
                        />
                    </>
                ),
            },
            {
                title: t('refIdentifiers.create.refInfoTitle'),
                error: false,
                isOpen: true,
                stepLabel: { label: '2', variant: 'circle' },
                content: (
                    <>
                        {type === RefIdentifierTypeEnum.URIKatalog && (
                            <RefCatalogForm
                                onSubmit={handleCatalogSubmit}
                                ciItemData={ciItemData}
                                attributes={attributes}
                                ownerOptions={ownerOptions}
                                datasetOptions={datasetOptions}
                                defaultDatasets={defaultDatasets}
                                defaultPo={defaultPo}
                            />
                        )}
                        {/* {type === RefIdentifierTypeEnum.Individuum && (
                            <RefTemplateUriForm
                                onSubmit={() => undefined}
                                attributeProfiles={attributeProfiles}
                                publicAuthorityState={publicAuthorityState}
                                attributes={attributes}
                                unitsData={unitsData}
                                constraintsData={constraintsData}
                                ciTypeData={ciTypeData}
                                ownerOptions={ownerOptions}
                            />
                        )}

                        {type === RefIdentifierTypeEnum.DatovyPrvok && (
                            <RefDataItemForm
                                onSubmit={() => undefined}
                                attributeProfiles={attributeProfiles}
                                publicAuthorityState={publicAuthorityState}
                                attributes={attributes}
                                unitsData={unitsData}
                                constraintsData={constraintsData}
                                ciTypeData={ciTypeData}
                                ownerOptions={ownerOptions}
                            />
                        )}

                        {type === RefIdentifierTypeEnum.URIDataset && (
                            <RefDatasetForm
                                onSubmit={() => undefined}
                                attributeProfiles={attributeProfiles}
                                publicAuthorityState={publicAuthorityState}
                                attributes={attributes}
                                unitsData={unitsData}
                                constraintsData={constraintsData}
                                ciTypeData={ciTypeData}
                                ownerOptions={ownerOptions}
                            />
                        )} */}
                    </>
                ),
            },
        ] ?? []

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refIdentifiers'), href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS },
                    { label: t('breadcrumbs.refIdentifiersCreate'), href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS },
                ]}
            />

            <MainContentWrapper>
                {!(isRedirectError || isProcessedError || isRedirectLoading) && (
                    <div ref={wrapperRef}>
                        <MutationFeedback success={false} error={isStoreError ? t('createEntity.mutationError') : ''} />
                    </div>
                )}
                <QueryFeedback
                    loading={isRedirectLoading}
                    error={isRedirectError || isProcessedError || isTooManyFetchesError}
                    indicatorProps={{
                        label: isUpdate ? t('createEntity.redirectLoadingEdit') : t('createEntity.redirectLoading'),
                    }}
                    errorProps={{
                        errorMessage: isTooManyFetchesError
                            ? t('createEntity.tooManyFetchesError')
                            : isUpdate
                            ? t('createEntity.redirectErrorEdit')
                            : t('createEntity.redirectError'),
                    }}
                    withChildren
                >
                    <TextHeading size="XL">{t('refIdentifiers.create.title')}</TextHeading>
                    <Stepper subtitleTitle="" stepperList={sections} />

                    <div id={REF_PORTAL_SUBMIT_ID} />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
