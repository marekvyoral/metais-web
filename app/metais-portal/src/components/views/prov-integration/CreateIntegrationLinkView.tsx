import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, ATTRIBUTE_PROFILE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { ErrorBlock, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Link, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { ConfigurationItemUiAttributes, useReadNeighboursConfigurationItemsHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { PO, PO_asociuje_Projekt, metaisEmail } from '@isdd/metais-common/constants'
import { useAddOrGetGroupHook, useIsOwnerByGidHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import {
    ApiIntegrationLink,
    getListIntegrationLinksQueryKey,
    useCreateIntegrationLink,
    useUpdateIntegrationLink,
} from '@isdd/metais-common/api/generated/provisioning-swagger'
import { useQueryClient } from '@tanstack/react-query'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { ElementToScrollTo } from '@isdd/metais-common/src/components/element-to-scroll-to/ElementToScrollTo'
import { useInvalidateCiItemCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { IntegrationLinkFormBody } from './IntegrationLinkFormBody'

import { ICreateIntegrationLinkContainerView } from '@/components/containers/CreateIntegrationLinkContainer'

export const CreateAndEditIntegrationLinkView: React.FC<ICreateIntegrationLinkContainerView> = (props) => {
    const {
        isError,
        isLoading,
        isUpdate,
        entityId,
        data: { intRole, ciTypeData },
    } = props
    const {
        state: { user },
    } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { setIsActionSuccess } = useActionSuccess()
    const [uploadError, setUploadError] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [ownerError, setOwnerError] = useState(false)

    const queryClient = useQueryClient()
    const readConsumingProjectNeighbours = useReadNeighboursConfigurationItemsHook()
    const addOrGetGroupHook = useAddOrGetGroupHook()
    const isOwnerById = useIsOwnerByGidHook()
    const { invalidate: invalidateCiItemCache } = useInvalidateCiItemCache()

    const updateIntegrationLink = useUpdateIntegrationLink({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess() {
                const integrationLinksListQK = getListIntegrationLinksQueryKey()
                const integrationDetailUrl = RouterRoutes.INTEGRATION_LIST + `/${entityId}`
                queryClient.invalidateQueries(integrationLinksListQK)
                invalidateCiItemCache(entityId)
                setIsActionSuccess({
                    value: true,
                    path: integrationDetailUrl,
                    additionalInfo: {
                        type: 'edit',
                    },
                })
                navigate(integrationDetailUrl)
            },
        },
    })

    const createIntegrationLink = useCreateIntegrationLink({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess() {
                const integrationLinksListQK = getListIntegrationLinksQueryKey()
                queryClient.invalidateQueries(integrationLinksListQK)
                setIsActionSuccess({
                    value: true,
                    path: RouterRoutes.INTEGRATION_LIST,
                    additionalInfo: {
                        type: 'create',
                    },
                })
                navigate(RouterRoutes.INTEGRATION_LIST)
            },
        },
    })

    const onSubmit = async (formData: ConfigurationItemUiAttributes) => {
        setUploadError(false)
        setOwnerError(false)
        setUploadLoading(true)

        const dataToSend: ApiIntegrationLink = {
            name: formData[ATTRIBUTE_NAME.Gen_Profil_nazov],
            nameEnglish: formData[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov],
            description: formData[ATTRIBUTE_NAME.Gen_Profil_popis],
            descriptionEnglish: formData[ATTRIBUTE_NAME.Gen_Profil_anglicky_popis],
            note: formData[ATTRIBUTE_NAME.Gen_Profil_poznamka],
            code: formData[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
            referencingIdentifier: formData[ATTRIBUTE_NAME.Gen_Profil_ref_id],
            source: formData[ATTRIBUTE_NAME.Gen_Profil_zdroj],
        }

        try {
            if (isUpdate) {
                updateIntegrationLink.mutateAsync({
                    integrationUuid: entityId,
                    data: {
                        ...dataToSend,
                        uuid: entityId,
                        consumingProject: {
                            uuid: formData[ATTRIBUTE_NAME.Gui_Profil_DIZ_konzumujuci_projekt],
                        },
                        providingProject: {
                            uuid: formData[ATTRIBUTE_NAME.Gui_Profil_DIZ_poskytujuci_projekt],
                        },
                    },
                })
            } else {
                if (!intRole?.uuid) {
                    setUploadError(true)
                    return
                }

                const consumingProjectNeighbours = await readConsumingProjectNeighbours(formData[ATTRIBUTE_NAME.Gui_Profil_DIZ_konzumujuci_projekt], {
                    nodeType: PO,
                    relationshipType: PO_asociuje_Projekt,
                })
                const group = await addOrGetGroupHook(intRole?.uuid ?? '', consumingProjectNeighbours?.toCiSet?.[0]?.uuid ?? '')
                const ownerByGid = await isOwnerById({
                    gids: [group.gid ?? ''],
                    login: user?.login,
                })

                const isOwner = ownerByGid.isOwner?.[0].owner
                const hasGroup = !!group.gid

                if (isOwner && hasGroup) {
                    const dizStatusDefaultValue = ciTypeData?.attributeProfiles
                        ?.find((profile) => profile.technicalName == ATTRIBUTE_PROFILE_NAME.Integracia_Profil_Integracia)
                        ?.attributes?.find((att) => att.technicalName == ATTRIBUTE_NAME.Integracia_Profil_Integracia_stav_diz)?.defaultValue

                    createIntegrationLink.mutateAsync({
                        data: {
                            ...dataToSend,
                            owner: group.gid,
                            dizStatus: dizStatusDefaultValue,
                            consumingProject: {
                                uuid: formData[ATTRIBUTE_NAME.Gui_Profil_DIZ_konzumujuci_projekt],
                            },
                            providingProject: {
                                uuid: formData[ATTRIBUTE_NAME.Gui_Profil_DIZ_poskytujuci_projekt],
                            },
                        },
                    })
                } else {
                    setOwnerError(true)
                }
            }
        } catch (error) {
            setUploadError(true)
        } finally {
            setUploadLoading(false)
        }
    }

    return (
        <QueryFeedback loading={isLoading || createIntegrationLink.isLoading || uploadLoading} withChildren>
            <ElementToScrollTo isVisible={createIntegrationLink.isError}>
                <MutationFeedback success={false} error={t('createEntity.mutationError')} />
            </ElementToScrollTo>

            <ElementToScrollTo isVisible={ownerError}>
                <MutationFeedback success={false} error={t('createEntity.ownerError')} />
            </ElementToScrollTo>

            <ElementToScrollTo isVisible={uploadError}>
                <ErrorBlock
                    errorTitle={t('createEntity.errorTitle')}
                    errorMessage={
                        <>
                            {t('createEntity.errorMessage')}
                            <Link className="govuk-link" state={{ from: location }} to={`mailto:${metaisEmail}`}>
                                {t('createEntity.email')}
                            </Link>
                        </>
                    }
                />
            </ElementToScrollTo>

            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('ciType.createEntity', { entityName: ciTypeData?.name })}</TextHeading>
                {isError && <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />}
            </FlexColumnReverseWrapper>

            <IntegrationLinkFormBody {...props} onSubmit={onSubmit} />
        </QueryFeedback>
    )
}
