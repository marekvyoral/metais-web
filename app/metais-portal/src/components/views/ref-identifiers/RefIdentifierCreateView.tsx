import { BreadCrumbs, HomeIcon, IOption, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiError } from '@isdd/metais-common/api/generated/iam-swagger'
import { Attribute, CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Group } from '@isdd/metais-common/contexts/auth/authContext'
import { MutationFeedback, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { RefCatalogForm } from './forms/RefCatalogForm'
import { RefDataItemForm } from './forms/RefDataItemForm'
import { RefDatasetForm } from './forms/RefDatasetForm'
import { RefTemplateUriForm } from './forms/RefTemplateUriForm'
import { RefCatalogFormType, RefDataItemFormType, RefDatasetFormType, RefTemplateUriFormType } from './forms/refCreateSchema'
import { refIdentifierTypeOptions } from './refIdentifierListProps'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export const REF_PORTAL_SUBMIT_ID = 'ref_form_submit_id'

export interface RefIdentifierCreateViewPropsType {
    ciItemData?: ConfigurationItemUi
    attributes: Attribute[] | undefined
    type?: RefIdentifierTypeEnum
    ciCode?: string
    groupData: Group[]
    setType?: (type: RefIdentifierTypeEnum) => void
    ciTypeData: CiType | undefined
    generatedEntityId: CiCode | undefined
    ownerId?: string
    ownerOptions: IOption<string>[]
    datasetOptions: IOption<string>[]
    templateUriOptions: IOption<string>[]
    dataItemTypeOptions: IOption<string>[]
    defaultDatasets?: string[]
    defaultPo?: string
    defaultTemplateUri?: string
    defaultDataItemTemplateUriUuids?: string[]
    defaultDatasetZC?: string
    defaultDatasetItem?: string
    updateCiItemId?: string
    wrapperRef: React.RefObject<HTMLTableSectionElement>
    handleCatalogSubmit: (formData: RefCatalogFormType, isSend: boolean) => void
    handleTemplateUriSubmit: (formData: RefTemplateUriFormType, isSend: boolean) => void
    handleDataItemSubmit: (formData: RefDataItemFormType, isSend: boolean) => void
    handleDatasetSubmit: (formData: RefDatasetFormType, isSend: boolean) => void
    isUpdate: boolean
    isDisabled?: boolean
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
    templateUriOptions,
    dataItemTypeOptions,
    defaultPo,
    defaultTemplateUri,
    defaultDatasetZC,
    defaultDatasetItem,
    defaultDataItemTemplateUriUuids,
    type,
    ciCode,
    setType,
    handleCatalogSubmit,
    handleTemplateUriSubmit,
    handleDataItemSubmit,
    handleDatasetSubmit,
    wrapperRef,
    isDisabled,
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
                                isUpdate={isUpdate}
                                isDisabled={isDisabled}
                                onSubmit={handleCatalogSubmit}
                                ciItemData={ciItemData}
                                attributes={attributes}
                                ownerOptions={ownerOptions}
                                datasetOptions={datasetOptions}
                                defaultDatasets={defaultDatasets}
                                defaultPo={defaultPo}
                            />
                        )}
                        {type === RefIdentifierTypeEnum.Individuum && (
                            <RefTemplateUriForm
                                isUpdate={isUpdate}
                                isDisabled={isDisabled}
                                onSubmit={handleTemplateUriSubmit}
                                ciItemData={ciItemData}
                                ciCode={ciCode}
                                templateUriOptions={templateUriOptions}
                                attributes={attributes}
                                ownerOptions={ownerOptions}
                                defaultTemplateUri={defaultTemplateUri}
                            />
                        )}

                        {type === RefIdentifierTypeEnum.DatovyPrvok && (
                            <RefDataItemForm
                                isUpdate={isUpdate}
                                isDisabled={isDisabled}
                                onSubmit={handleDataItemSubmit}
                                ciItemData={ciItemData}
                                templateUriOptions={templateUriOptions}
                                dataItemTypeOptions={dataItemTypeOptions}
                                attributes={attributes}
                                ownerOptions={ownerOptions}
                                datasetOptions={datasetOptions}
                                defaultDatasets={defaultDatasets}
                                defaultDataItemTemplateUriUuids={defaultDataItemTemplateUriUuids}
                                defaultPo={defaultPo}
                            />
                        )}

                        {type === RefIdentifierTypeEnum.URIDataset && (
                            <RefDatasetForm
                                isUpdate={isUpdate}
                                isDisabled={isDisabled}
                                onSubmit={handleDatasetSubmit}
                                ciItemData={ciItemData}
                                templateUriOptions={templateUriOptions}
                                attributes={attributes}
                                ownerOptions={ownerOptions}
                                defaultDatasetZC={defaultDatasetZC}
                                defaultDatasetItem={defaultDatasetItem}
                            />
                        )}
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
                    {
                        label: isUpdate ? t('breadcrumbs.refIdentifiersEdit') : t('breadcrumbs.refIdentifiersCreate'),
                        href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS,
                    },
                ]}
            />

            <MainContentWrapper>
                {!(isRedirectError || isProcessedError || isRedirectLoading) && (
                    <div ref={wrapperRef}>
                        <MutationFeedback success={false} error={isStoreError ? t('createEntity.mutationError') : ''} />
                    </div>
                )}
                <QueryFeedback
                    loading={isRedirectLoading || isLoading}
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
                    {isError && <QueryFeedback error loading={false} />}
                    <TextHeading size="XL">{isUpdate ? t('refIdentifiers.create.editTitle') : t('refIdentifiers.create.title')}</TextHeading>
                    <Stepper subtitleTitle="" stepperList={sections} />

                    <div id={REF_PORTAL_SUBMIT_ID} />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
