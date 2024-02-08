import { BreadCrumbs, Button, ButtonGroupRow, ButtonLink, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { RefCatalogInfoView } from './RefCatalogInfoView'
import { RefDataItemInfoView } from './RefDataItemInfoView'
import { RefDatasetInfoView } from './RefDatasetInfoView'
import { RefTemplateUriInfoView } from './RefTemplateUriInfoView'

import { RefIdentifierDetailContainerViewProps } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const RefIdentifierDetailView: React.FC<RefIdentifierDetailContainerViewProps> = ({
    ciItemId,
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
                return (
                    <RefDatasetInfoView
                        ciItemData={ciItemData}
                        attributes={attributes}
                        registrationState={registrationState}
                        gestorName={gestorName}
                    />
                )
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
                return (
                    <RefTemplateUriInfoView
                        ciItemData={ciItemData}
                        attributes={attributes}
                        registrationState={registrationState}
                        gestorName={gestorName}
                    />
                )
            }
            default:
                return <></>
        }
    }

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
                        href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_DETAIL,
                    },
                ]}
            />

            <MainContentWrapper>
                {isError && <QueryFeedback error={isError} loading={false} />}
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    {/* <div className={styles.headerDiv}> */}
                    <TextHeading size="XL">{entityItemName}</TextHeading>
                    <ButtonGroupRow>
                        {/* <Can I={Actions.EDIT} a={Subjects.DETAIL}> */}
                        <Button
                            label={t('codeListDetail.button.edit')}
                            onClick={() => navigate(`${NavigationSubRoutes.REF_IDENTIFIERS}/${ciItemId}/edit`)}
                        />
                        {/* </Can> */}
                    </ButtonGroupRow>
                    {/* </div> */}
                    {renderInfoView()}
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
