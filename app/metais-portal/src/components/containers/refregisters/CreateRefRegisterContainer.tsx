import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ApiContact,
    ApiDescription,
    ApiReferenceRegister,
    useCreateReferenceRegister1,
    useUpdateReferenceRegister,
    useUpdateReferenceRegisterAccessData,
    useUpdateReferenceRegisterContact,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { transformAttributes } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { Group } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useUserInfo } from '@isdd/metais-common/hooks/useUserInfo'
import { Gui_Profil_RR, QueryKeysByEntity } from '@isdd/metais-common/index'
import { useCallback, useMemo } from 'react'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useNavigate } from 'react-router-dom'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useQueryClient } from '@tanstack/react-query'

import { useRefRegisterHook } from '@/hooks/useRefRegister.hook'
import { IRefRegisterCreateView } from '@/components/views/refregisters/createView/RefRegisterCreateView'

interface IView extends IRefRegisterCreateView {
    guiAttributes: Attribute[]
    referenceRegisterData: ApiReferenceRegister | undefined
    isLoading: boolean
    isError: boolean
}
interface ICreateRefRegisterContainer {
    entityName: string
    entityId?: string
    View: React.FC<IView>
}

const POFilter = {
    sortBy: 'Gen_Profil_nazov',
    sortType: 'ASC',
    filter: {
        type: ['PO'],
        metaAttributes: {
            state: ['APPROVED_BY_OWNER', 'DRAFT'],
        },
        attributes: [
            {
                name: 'EA_Profil_PO_kategoria_osoby',
                filterValue: [
                    {
                        value: 'c_kategoria_osoba.4',
                        equality: 'EQUAL',
                    },
                ],
            },
        ],
    },
}

export const CreateRefRegisterContainer = ({ entityName, entityId, View }: ICreateRefRegisterContainer) => {
    const { user } = useUserInfo()
    const userGroupsFilter = {
        filter: {
            metaAttributes: {
                state: ['DRAFT'],
            },
            uuid: user?.groupData.map((group: Group) => group.orgId),
        },
    }
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { referenceRegisterData, guiAttributes, isLoading: isRefLoading, isError: isRefError } = useRefRegisterHook(entityId)
    const { ciTypeData, isLoading: isAttributesLoading, isError: isAttributesError } = useAttributesHook(entityName)

    const { data: userGroupData, isLoading: isUserGroupDataLoading, isError } = useReadCiList1({ ...userGroupsFilter })
    const { data: guiData } = useGetAttributeProfile(Gui_Profil_RR)
    const { data: POData } = useReadCiList1({ ...POFilter })

    const { mutateAsync: saveRefRegAsync, isError: saveMutationIsError } = useCreateReferenceRegister1()
    const { mutateAsync: updateRefRegAsync, isError: updateMutationIsError } = useUpdateReferenceRegister()
    const { setIsActionSuccess } = useActionSuccess()
    const { getRequestStatus, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading } = useGetStatus()

    const onCreateSuccess = useCallback(() => {
        setIsActionSuccess({
            value: true,
            path: `${NavigationSubRoutes.REFERENCE_REGISTER}`,
            additionalInfo: { type: 'create' },
        })
        queryClient.invalidateQueries([QueryKeysByEntity.REFERENCE_REGISTERS])
        navigate(`${NavigationSubRoutes.REFERENCE_REGISTER}`)
    }, [navigate, queryClient, setIsActionSuccess])

    const saveRefRegister = async (formData: ApiReferenceRegister) => {
        const response = await saveRefRegAsync({
            data: formData,
        })
        getRequestStatus(response?.requestId ?? '', onCreateSuccess)
    }

    const updateRefRegister = async (referenceRegisterUuid: string, formData: ApiReferenceRegister) => {
        await updateRefRegAsync({ referenceRegisterUuid, data: formData })
    }

    const { mutateAsync: updateContactAsync, isError: updateContactMutationIsError } = useUpdateReferenceRegisterContact()
    const updateContact = async (referenceRegisterUuid: string, data: ApiContact) => {
        await updateContactAsync({ referenceRegisterUuid, data })
    }

    const { mutateAsync: updateAccessDataAsync, isError: updateAccessDataMutationIsError } = useUpdateReferenceRegisterAccessData()
    const updateAccessData = async (referenceRegisterUuid: string, data: ApiDescription) => {
        await updateAccessDataAsync({ referenceRegisterUuid, data })
    }

    const isLoading = [isAttributesLoading, isRefLoading, isUserGroupDataLoading, isRedirectLoading].some((item) => item)

    const isMutationError = [
        saveMutationIsError,
        updateMutationIsError,
        updateContactMutationIsError,
        updateAccessDataMutationIsError,
        isAttributesError,
        isRefError,
        isError,
        isRedirectError,
        isProcessedError,
    ].some((item) => item)

    const transformedAttributes = useMemo(
        () => transformAttributes([...(ciTypeData?.attributes ?? []), ...(guiData?.attributes ?? [])]),
        [ciTypeData?.attributes, guiData?.attributes],
    )

    return (
        <View
            userGroupData={userGroupData}
            isLoading={isLoading}
            isError={isMutationError}
            POData={POData}
            referenceRegisterData={referenceRegisterData}
            renamedAttributes={transformedAttributes}
            guiAttributes={guiAttributes}
            saveRefRegister={saveRefRegister}
            updateRefRegister={updateRefRegister}
            updateContact={updateContact}
            updateAccessData={updateAccessData}
        />
    )
}
