import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { useGetRoleParticipantBulk, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ApiCodelistPreview,
    useDeleteTemporalCodelistHeader,
    useGetCodelistHeader,
    useGetTemporalCodelistHeaderWithLock,
    useGetUnlockTemporalCodelistHeader,
    useUpdateAndUnlockTemporalCodelistHeader,
    useUpdateCodelistContactData,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useInvalidateCodeListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { Roles } from '@isdd/metais-common/api'
import { getOrgIdFromGid, getRoleUuidFromGid } from '@isdd/metais-common/utils/utils'

import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'
import { IEditCodeListForm, mapEditFormDataToCodeList, mapFormToContactData } from '@/componentHelpers'
import { IOption } from '@/components/views/codeLists/CodeListEditView'
import { getErrorTranslateKeys } from '@/componentHelpers/codeList'
import { getRoleUUID } from '@/componentHelpers/requests'

export interface CodeListDetailData {
    codeList?: ApiCodelistPreview
    attributeProfile?: AttributeProfile
    defaultManagers?: IOption[]
}

export interface EditCodeListContainerViewProps {
    data: CodeListDetailData
    requestId?: string
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    errorMessages: string[]
    handleSave: (formData: IEditCodeListForm) => Promise<void>
    handleRemoveLock: () => void
    handleDiscardChanges: () => void
    loadOptions: (
        searchQuery: string,
        isMainGestor: boolean,
        additional: { page: number } | undefined,
    ) => Promise<{
        options: { name: string; value: string }[]
        hasMore: boolean
        additional: {
            page: number
        }
    }>
}

interface EditCodeListContainerContainerProps {
    View: React.FC<EditCodeListContainerViewProps>
}

export const EditCodeListContainerContainer: React.FC<EditCodeListContainerContainerProps> = ({ View }) => {
    const user = useAuth()
    const { i18n } = useTranslation()
    const { id: codeId } = useParams()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate } = useInvalidateCodeListCache()

    const [errorCheck, setErrorCheck] = useState<{ message: string }>()
    const [isLoadingCheck, setIsLoadingCheck] = useState<boolean>()

    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])
    const { mutateAsync: mutateAsyncImplicitHierarchy } = useReadCiList()

    const {
        mutateAsync: mutateAsyncUnlock,
        isLoading: isLoadingUnlock,
        isError: isErrorUnlock,
        error: errorUnlock,
    } = useGetUnlockTemporalCodelistHeader()
    const {
        mutateAsync: mutateAsyncDiscard,
        isLoading: isLoadingDiscard,
        isError: isErrorDiscard,
        error: errorDiscard,
    } = useDeleteTemporalCodelistHeader()
    const {
        mutateAsync: mutateAsyncSave,
        isLoading: isLoadingSave,
        isError: isErrorSave,
        error: errorSave,
    } = useUpdateAndUnlockTemporalCodelistHeader()
    const {
        mutateAsync: mutateAsyncContactData,
        isLoading: isLoadingContactData,
        isError: isErrorContactData,
        error: errorContactData,
    } = useUpdateCodelistContactData()
    const canGetGroup = useAddOrGetGroupHook()
    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const { isLoading: isLoadingData, isError: isErrorData, data: codeListData } = useGetCodelistHeader(Number(codeId))
    const {
        isInitialLoading: isLoadingTemporalLocked,
        isError: isErrorTemporalLocked,
        error: errorTemporalLocked,
        data: codeListTemporalLockedData,
    } = useGetTemporalCodelistHeaderWithLock(codeListData?.code ?? '', { query: { enabled: !!codeListData } })

    const requestGestorGids = [
        ...(codeListData?.mainCodelistManagers?.map((gestor) => gestor.value || '') || []),
        ...(codeListData?.codelistManagers?.map((gestor) => gestor.value || '') || []),
    ]

    const {
        isFetching: isLoadingRoleParticipants,
        isError: isErrorRoleParticipants,
        data: roleParticipantsData,
    } = useGetRoleParticipantBulk(
        { gids: requestGestorGids },
        {
            query: { enabled: requestGestorGids.length > 0 },
        },
    )

    const data: CodeListDetailData = {
        codeList: codeListTemporalLockedData,
        attributeProfile: attributeProfile,
        defaultManagers: roleParticipantsData?.map((item) => ({
            name: item.configurationItemUi?.attributes?.Gen_Profil_nazov,
            value: item.configurationItemUi?.uuid,
        })),
    }

    const loadOptions = async (searchQuery: string, isMainGestor: boolean, additional: { page: number } | undefined) => {
        const roleName = isMainGestor ? Roles.SZC_HLGES : Roles.SZC_VEDGES
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await mutateAsyncImplicitHierarchy({
            data: {
                perpage: 20,
                sortBy: SortBy.HIERARCHY_FROM_ROOT,
                sortType: SortType.ASC,
                rights: userDataGroups
                    .filter((group) => group.roles.some((role) => role.roleName === roleName))
                    .map((group) => ({
                        poUUID: group.orgId,
                        roles: group.roles.filter((role) => role.roleName === roleName).map((role) => role.roleUuid),
                    })),
                page,
                fullTextSearch: searchQuery,
            },
        })

        return {
            options:
                options.rights?.map((item) => ({
                    name: item.poName || '',
                    value: `${getRoleUUID(userDataGroups, roleName)}-${item.poUUID || ''}`,
                })) || [],
            hasMore: options.rights?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const handleRemoveLock = () => {
        mutateAsyncUnlock({ code: codeListData?.code ?? '' }).then(() => {
            invalidate(codeListData?.code ?? '', Number(codeListData?.id))
            const path = `${NavigationSubRoutes.CODELIST}/${data.codeList?.id}`
            setIsActionSuccess({ value: true, path })
            navigate(path)
        })
    }

    const handleDiscardChanges = () => {
        mutateAsyncDiscard({ code: codeListData?.code ?? '' }).then(() => {
            const path = `${NavigationSubRoutes.CODELIST}`
            setIsActionSuccess({ value: true, path })
            navigate(path)
        })
    }

    const saveData = (requestData: ApiCodelistPreview) => {
        const codeListPromise = mutateAsyncSave({ code: codeListData?.code ?? '', data: requestData })
        const contactPromise = mutateAsyncContactData({ code: codeListData?.code ?? '', data: mapFormToContactData(requestData) })

        Promise.all([codeListPromise, contactPromise]).then(() => {
            invalidate(codeListData?.code ?? '', Number(codeListData?.id))
            const path = `${NavigationSubRoutes.CODELIST}/${data.codeList?.id}`
            setIsActionSuccess({ value: true, path })
            navigate(path)
        })
    }

    const handleSave = async (formData: IEditCodeListForm) => {
        const normalizedData = mapEditFormDataToCodeList(formData, data.codeList, i18n.language)
        const nextGestors = formData.nextGestor || []
        const mainGestors = [...(formData.mainGestor ?? [])]

        const gestorPromises = [...mainGestors, ...nextGestors]?.map(async (item) =>
            canGetGroup(getRoleUuidFromGid(item?.value ?? ''), getOrgIdFromGid(item?.value ?? '')),
        )

        if (gestorPromises.length > 0) {
            setErrorCheck(undefined)
            setIsLoadingCheck(true)
            Promise.all(gestorPromises)
                .then(() => {
                    saveData(normalizedData)
                })
                .catch((error) => {
                    setErrorCheck(error)
                })
                .finally(() => {
                    setIsLoadingCheck(false)
                })
        }
    }

    const isLoading = [isLoadingData, isLoadingTemporalLocked, isLoadingAttributeProfile, isLoadingRoleParticipants].some((item) => item)
    const isLoadingMutation = [isLoadingUnlock, isLoadingSave, isLoadingDiscard, isLoadingContactData, isLoadingCheck].some((item) => item)
    const isError = [
        isErrorSave,
        errorCheck,
        isErrorDiscard,
        isErrorUnlock,
        isErrorTemporalLocked,
        isErrorData,
        isErrorAttributeProfile,
        isErrorRoleParticipants,
        isErrorContactData,
    ].some((item) => item)
    const errorMessages = getErrorTranslateKeys(
        [errorTemporalLocked, errorCheck, errorUnlock, errorDiscard, errorSave, errorContactData].map((item) => item as { message: string }),
    )

    return (
        <CodeListPermissionsWrapper id={codeId ?? ''}>
            <View
                data={data}
                isError={isError}
                errorMessages={errorMessages}
                isLoading={isLoading}
                isLoadingMutation={isLoadingMutation}
                loadOptions={loadOptions}
                handleSave={handleSave}
                handleRemoveLock={handleRemoveLock}
                handleDiscardChanges={handleDiscardChanges}
            />
        </CodeListPermissionsWrapper>
    )
}
