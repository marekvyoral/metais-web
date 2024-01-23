import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { useGetRoleParticipantBulk, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ApiCodelistPreview,
    getGetCodelistHeaderQueryKey,
    getGetCodelistHeadersQueryKey,
    useGetCodelistHeader,
    useGetOriginalCodelistHeader,
    useGetTemporalCodelistHeaderWithLock,
    useUpdateAndUnlockTemporalCodelistHeader,
    useUpdateCodelistContactData,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInvalidateCodeListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { Roles } from '@isdd/metais-common/api'
import { getOrgIdFromGid, getRoleUuidFromGid } from '@isdd/metais-common/utils/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useCodeListWorkingLanguage } from '@isdd/metais-common/contexts/codeListWorkingLanguage/codeListWorkingLanguageContext'

import { getAllWorkingLanguages } from '@/components/views/codeLists/CodeListDetailUtils'
import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'
import { IEditCodeListForm, mapEditFormDataToCodeList, mapFormToContactData } from '@/componentHelpers'
import { IOption } from '@/components/views/codeLists/CodeListEditView'
import { getErrorTranslateKeys } from '@/componentHelpers/codeList'
import { getRoleUUID } from '@/componentHelpers/requests'

export interface CodeListDetailData {
    codeList?: ApiCodelistPreview
    codeListOriginal?: ApiCodelistPreview
    attributeProfile?: AttributeProfile
    defaultManagers?: IOption[]
}

export interface EditCodeListContainerViewProps {
    data: CodeListDetailData
    workingLanguage: string
    requestId?: string
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    errorMessages: string[]
    handleSave: (formData: IEditCodeListForm) => Promise<void>
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
    const queryClient = useQueryClient()
    const { workingLanguage, setWorkingLanguage } = useCodeListWorkingLanguage()

    const { id: codeId } = useParams()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate } = useInvalidateCodeListCache()

    const [errorCheck, setErrorCheck] = useState<{ message: string }>()
    const [isLoadingCheck, setIsLoadingCheck] = useState<boolean>()

    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])
    const { mutateAsync: mutateAsyncImplicitHierarchy } = useReadCiList()

    const { mutateAsync: mutateAsyncSave, isLoading: isLoadingSave, error: errorSave } = useUpdateAndUnlockTemporalCodelistHeader()
    const { mutateAsync: mutateAsyncContactData, isLoading: isLoadingContactData, error: errorContactData } = useUpdateCodelistContactData()
    const canGetGroup = useAddOrGetGroupHook()
    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const { isLoading: isLoadingData, isError: isErrorData, data: codeListData } = useGetCodelistHeader(Number(codeId))
    const {
        isFetching: isLoadingOriginal,
        isError: isErrorOriginal,
        data: codeListOriginalData,
    } = useGetOriginalCodelistHeader(codeListData?.code ?? '', { query: { enabled: !!codeListData } })
    const {
        isInitialLoading: isLoadingTemporalLocked,
        error: errorTemporalLocked,
        data: codeListTemporalLockedData,
    } = useGetTemporalCodelistHeaderWithLock(codeListData?.code ?? '', {
        query: {
            onSuccess: () => {
                queryClient.invalidateQueries([getGetCodelistHeadersQueryKey({ language: '', pageNumber: 0, perPage: 0 })[0]])
                queryClient.invalidateQueries([getGetCodelistHeaderQueryKey(Number(codeId))[0]])
            },
            enabled: !!codeListData,
        },
    })
    const requestGestorGids = [
        ...(codeListTemporalLockedData?.mainCodelistManagers?.map((gestor) => gestor.value || '') || []),
        ...(codeListTemporalLockedData?.codelistManagers?.map((gestor) => gestor.value || '') || []),
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

    useEffect(() => {
        const languages = getAllWorkingLanguages(codeListTemporalLockedData)
        if (languages.length > 0 && !languages.includes(workingLanguage)) {
            setWorkingLanguage('sk')
        }
    }, [codeListTemporalLockedData, setWorkingLanguage, workingLanguage])

    const data: CodeListDetailData = {
        codeList: codeListTemporalLockedData,
        codeListOriginal: codeListOriginalData,
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

    const saveData = (requestData: ApiCodelistPreview) => {
        // contact info is saved after codelist save to prevent errors.
        // some codelist states can prevent contact info from saving.
        mutateAsyncSave({ code: codeListTemporalLockedData?.code ?? '', data: requestData })
            .then(() => mutateAsyncContactData({ code: codeListTemporalLockedData?.code ?? '', data: mapFormToContactData(requestData) }))
            .then(() => {
                invalidate(codeListTemporalLockedData?.code ?? '', Number(codeListTemporalLockedData?.id))
                const path = `${NavigationSubRoutes.CODELIST}/${codeListTemporalLockedData?.id}`
                setIsActionSuccess({ value: true, path })
                navigate(path)
            })
    }

    const handleSave = async (formData: IEditCodeListForm) => {
        const normalizedData = mapEditFormDataToCodeList(formData, codeListTemporalLockedData, workingLanguage)
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
    const isLoadingMutation = [isLoadingSave, isLoadingContactData, isLoadingCheck, isLoadingOriginal].some((item) => item)
    const isError = [isErrorData, isErrorAttributeProfile, isErrorRoleParticipants, isErrorOriginal].some((item) => item)
    const errorMessages = getErrorTranslateKeys(
        [errorTemporalLocked, errorCheck, errorSave, errorContactData].map((item) => item as { message: string }),
    )

    return (
        <CodeListPermissionsWrapper id={codeId ?? ''}>
            <View
                data={data}
                workingLanguage={workingLanguage}
                isError={isError}
                errorMessages={errorMessages}
                isLoading={isLoading}
                isLoadingMutation={isLoadingMutation}
                loadOptions={loadOptions}
                handleSave={handleSave}
            />
        </CodeListPermissionsWrapper>
    )
}
