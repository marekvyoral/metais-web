import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { RefCatalogInfoView } from './RefCatalogInfoView'
import { RefDataItemInfoView } from './RefDataItemInfoView'
import { RefDatasetInfoView } from './RefDatasetInfoView'
import styles from './refIdentifiers.module.scss'
import { RefTemplateUriInfoView } from './RefTemplateUriInfoView'

import { RefIdentifierDetailContainerViewProps } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'

export const RefIdentifierDetailView: React.FC<RefIdentifierDetailContainerViewProps> = ({
    ciItemId,
    canEdit,
    entityItemName,
    ciItemData,
    attributes,
    gestorName,
    dataItemTypeState,
    ciList,
    registrationState,
    isLoading,
    isError,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { isActionSuccess } = useActionSuccess()

    const getActionSuccessMessage = (type: string | undefined) => {
        switch (type) {
            case 'create': {
                return t('mutationFeedback.successfulCreated')
            }
            case 'edit': {
                return t('mutationFeedback.successfulUpdated')
            }
            case 'invalidate': {
                return t('mutationFeedback.successfulInvalidated')
            }
            default: {
                return t('mutationFeedback.success')
            }
        }
    }

    const renderInfoView = () => {
        switch (ciItemData?.type) {
            case RefIdentifierTypeEnum.URIKatalog: {
                return (
                    <RefCatalogInfoView
                        ciList={ciList}
                        ciItemData={ciItemData}
                        attributes={attributes}
                        registrationState={registrationState}
                        gestorName={gestorName}
                    />
                )
            }
            case RefIdentifierTypeEnum.URIDataset: {
                return <RefDatasetInfoView ciItemData={ciItemData} attributes={attributes} registrationState={registrationState} />
            }
            case RefIdentifierTypeEnum.DatovyPrvok: {
                return (
                    <RefDataItemInfoView
                        ciItemData={ciItemData}
                        attributes={attributes}
                        ciList={ciList}
                        dataItemTypeState={dataItemTypeState}
                        registrationState={registrationState}
                        gestorName={gestorName}
                    />
                )
            }
            case RefIdentifierTypeEnum.Individuum: {
                return <RefTemplateUriInfoView ciItemData={ciItemData} attributes={attributes} registrationState={registrationState} />
            }
            default:
                return <></>
        }
    }
    document.title = `${t('titles.refIdentifiers')} - ${
        ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName')
    } ${META_IS_TITLE}`
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refIdentifiers'), href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `${RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS}/${ciItemId}`,
                    },
                ]}
            />

            <MainContentWrapper>
                <CiPermissionsWrapper entityName={ciItemData?.type ?? ''} entityId={ciItemId ?? ''}>
                    <div>
                        <QueryFeedback error={isError} loading={false} />
                        <ElementToScrollTo trigger={isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated'}>
                            <MutationFeedback
                                success={isActionSuccess.value}
                                successMessage={getActionSuccessMessage(isActionSuccess.additionalInfo?.type)}
                            />
                        </ElementToScrollTo>
                        <QueryFeedback loading={isLoading} error={false} withChildren>
                            <div className={styles.headerDiv}>
                                <TextHeading size="XL">{entityItemName}</TextHeading>
                                <ButtonGroupRow>
                                    <Can I={Actions.EDIT} a={`ci.${ciItemId}`}>
                                        {canEdit && (
                                            <Button
                                                label={t('codeListDetail.button.edit')}
                                                onClick={() => navigate(`${NavigationSubRoutes.REF_IDENTIFIERS}/${ciItemId}/edit`)}
                                            />
                                        )}
                                    </Can>
                                </ButtonGroupRow>
                            </div>
                            {renderInfoView()}
                        </QueryFeedback>
                    </div>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}
