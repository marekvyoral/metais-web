import { BreadCrumbs, HomeIcon, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'

import { RefCatalogInfoView } from './RefCatalogInfoView'
import { RefDataItemInfoView } from './RefDataItemInfoView'
import { RefDatasetInfoView } from './RefDatasetInfoView'
import { RefTemplateUriInfoView } from './RefTemplateUriInfoView'
import { RefIdentifierListShowEnum, refIdentifierTypeOptions } from './refIdentifierListProps'
import { RefCatalogForm } from './forms/RefCatalogForm'
import { RefTemplateUriForm } from './forms/RefTemplateUriForm'
import { RefDataItemForm } from './forms/RefDataItemForm'
import { RefDatasetForm } from './forms/RefDatasetForm'

import { RefIdentifierDetailContainerViewProps } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RefIdentifierCreateContainerViewProps } from '@/components/containers/ref-identifiers/RefIdentifierCreateContainer'

export const RefIdentifierCreateView: React.FC<RefIdentifierCreateContainerViewProps> = ({
    publicAuthorityState,
    attributes,
    constraintsData,
    generatedEntityId,
    attributeProfiles,
    unitsData,
    ciTypeData,
    ownerOptions,
    type,
    datasetOptions,
    setType,
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
                            value={type}
                            onChange={(newValue) => setType(newValue as RefIdentifierTypeEnum)}
                            isClearable={false}
                            // setValue={setValue}
                            defaultValue={RefIdentifierTypeEnum.DatovyPrvok}
                            name="state"
                        />
                    </>
                ),
            },
            {
                title: t('refIdentifiers.create.refInfoTitle'),
                error: false,
                stepLabel: { label: '2', variant: 'circle' },
                content: (
                    <>
                        {type === RefIdentifierTypeEnum.URIKatalog && (
                            <RefCatalogForm
                                onSubmit={() => undefined}
                                attributeProfiles={attributeProfiles}
                                generatedEntityId={generatedEntityId}
                                publicAuthorityState={publicAuthorityState}
                                attributes={attributes}
                                unitsData={unitsData}
                                constraintsData={constraintsData}
                                ciTypeData={ciTypeData}
                                ownerOptions={ownerOptions}
                                datasetOptions={datasetOptions}
                            />
                        )}
                        {type === RefIdentifierTypeEnum.Individuum && (
                            <RefTemplateUriForm
                                onSubmit={() => undefined}
                                attributeProfiles={attributeProfiles}
                                generatedEntityId={generatedEntityId}
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
                                generatedEntityId={generatedEntityId}
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
                                generatedEntityId={generatedEntityId}
                                publicAuthorityState={publicAuthorityState}
                                attributes={attributes}
                                unitsData={unitsData}
                                constraintsData={constraintsData}
                                ciTypeData={ciTypeData}
                                ownerOptions={ownerOptions}
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
                    { label: t('breadcrumbs.refIdentifiersCreate'), href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS },
                    // {
                    //     label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                    //     href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_DETAIL,
                    // },
                ]}
            />

            <MainContentWrapper>
                {/* {isError && <QueryFeedback error={isError} loading={false} />} */}
                {/* <QueryFeedback loading={isLoading} error={false} withChildren> */}
                <TextHeading size="XL">{t('refIdentifiers.create.title')}</TextHeading>
                <Stepper subtitleTitle="" stepperList={sections} />
                {/* </QueryFeedback> */}
            </MainContentWrapper>
        </>
    )
}
