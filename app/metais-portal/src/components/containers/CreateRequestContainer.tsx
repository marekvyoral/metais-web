import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { Roles } from '@isdd/metais-common/api/constants'
import { HierarchyPOFilterUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    useCreateCodelistRequest,
    useExistsCodelist,
    useGetFirstNotUsedCode,
    useSaveAndSendCodelist,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { RequestListState } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useInvalidateCodeListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ErrorTranslateKeyType, getErrorTranslateKeys } from '@isdd/metais-common/src/utils/errorMapper'
import { getOrgIdFromGid } from '@isdd/metais-common/utils/utils'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IRequestForm, getRoleUUID, mapFormToSave } from '@/componentHelpers/requests'
import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IOption } from '@/components/views/requestLists/CreateRequestView'
import { IItemDates } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'

export interface CreateRequestViewProps {
    requestId?: string
    workingLanguage: string
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    errorMessages: ErrorTranslateKeyType[]
    isSuccessSetDates?: boolean
    errorMessageSetDates?: string
    attributeProfile: AttributeProfile
    canEdit?: boolean
    firstNotUsedCode?: string
    editData?: IRequestForm
    onHandleCheckIfCodeIsAvailable: (code: string) => Promise<{ isAvailable: boolean; errorTranslateKeys: ErrorTranslateKeyType[] }>
    onGetMainGestor?: (gid: string) => Promise<IOption>
    onSend: (formData: IRequestForm) => Promise<void>
    onSave: (formData: IRequestForm) => Promise<void>
    onSaveDates?: (dates: IItemDates, items: Record<string, IItemForm>) => void
    loadOptions: (
        searchQuery: string,
        additional: { page: number } | undefined,
    ) => Promise<{
        options: { name: string; value: string }[]
        hasMore: boolean
        additional: {
            page: number
        }
    }>
}

interface CreateRequestContainerProps {
    View: React.FC<CreateRequestViewProps>
}

export const CreateRequestContainer: React.FC<CreateRequestContainerProps> = ({ View }) => {
    const {
        state: { user },
    } = useAuth()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    // WorkingLanguage is forced to system default 'sk' for requests.
    // Content is created and displayed in only one language.
    const workingLanguage = 'sk'

    const addOrGetGroupHook = useAddOrGetGroupHook()
    const { invalidateRequests } = useInvalidateCodeListCache()

    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])
    const [errorAddOrGetGroup, setAddOrGetGroupError] = useState<{ message: string }>()
    const [isAddOrGetGroupLoading, setIsAddOrGetGroupLoading] = useState<boolean>(false)

    const implicitHierarchy = useReadCiList()
    const { mutateAsync, isLoading: isLoadingSave, isError: isErrorSave, error: errorSave } = useCreateCodelistRequest()
    const { mutateAsync: mutateSendASync, isLoading: isLoadingSend, isError: isErrorSend, error: errorSend } = useSaveAndSendCodelist()
    const { data: firstNotUsedCode, isLoading: isLoadingGetFirstNotUsedCode } = useGetFirstNotUsedCode({ query: { cacheTime: 0 } })
    const { data: attributeProfile, isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')
    const { mutateAsync: mutateExists, isLoading: isLoadingExists } = useExistsCodelist()

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups
            .filter((group) => group.roles.some((role) => role.roleName === Roles.SZC_HLGES))
            .map((group) => ({
                poUUID: group.orgId,
                roles: group.roles.filter((role) => role.roleName === Roles.SZC_HLGES).map((role) => role.roleUuid),
            })),
    }

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await implicitHierarchy.mutateAsync({ data: { ...defaultFilter, page, fullTextSearch: searchQuery } })

        return {
            options:
                options.rights?.map((item) => ({
                    name: item.poName || '',
                    value: `${getRoleUUID(user?.groupData ?? [], Roles.SZC_HLGES)}-${item.poUUID || ''}`,
                })) || [],
            hasMore: options.rights?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const handleCheckIfCodeIsAvailable = async (code: string) => {
        return mutateExists({ data: { code: code, codelistState: RequestListState.NEW_REQUEST } })
            .then(() => {
                return {
                    isAvailable: true,
                    errorTranslateKeys: [],
                }
            })
            .catch((error) => {
                const errorTranslateKeys = getErrorTranslateKeys([error as { message: string }])
                return {
                    isAvailable: false,
                    errorTranslateKeys,
                }
            })
    }

    const onSave = async (formData: IRequestForm) => {
        const uuid = getRoleUUID(user?.groupData ?? [], Roles.SZC_HLGES)
        const saveData = mapFormToSave(formData, workingLanguage)
        setAddOrGetGroupError(undefined)
        setIsAddOrGetGroupLoading(true)
        addOrGetGroupHook(uuid, getOrgIdFromGid(formData?.mainGestor))
            .then(() => {
                setIsAddOrGetGroupLoading(false)
                mutateAsync({ data: saveData }).then(() => {
                    invalidateRequests()
                    setIsActionSuccess({
                        value: true,
                        path: NavigationSubRoutes.REQUESTLIST,
                        additionalInfo: { messageKey: 'mutationFeedback.successfulCreated' },
                    })
                    navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                })
            })
            .catch((error) => {
                setIsAddOrGetGroupLoading(false)
                setAddOrGetGroupError(error)
            })
    }

    const onSend = async (formData: IRequestForm) => {
        const uuid = getRoleUUID(user?.groupData ?? [], Roles.SZC_HLGES)
        const saveData = mapFormToSave(formData, workingLanguage)
        setAddOrGetGroupError(undefined)
        setIsAddOrGetGroupLoading(true)
        addOrGetGroupHook(uuid, getOrgIdFromGid(formData?.mainGestor))
            .then(() => {
                setIsAddOrGetGroupLoading(false)
                mutateSendASync({ data: saveData }).then(() => {
                    invalidateRequests()
                    setIsActionSuccess({
                        value: true,
                        path: NavigationSubRoutes.REQUESTLIST,
                        additionalInfo: { messageKey: 'mutationFeedback.successfulCreated' },
                    })
                    navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                })
            })
            .catch((error) => {
                setIsAddOrGetGroupLoading(false)
                setAddOrGetGroupError(error)
            })
    }

    const isLoading = [isLoadingGetFirstNotUsedCode, isLoadingAttributeProfile].some((item) => item)
    const isLoadingMutation = [isLoadingSave, isLoadingSend, isLoadingExists, isAddOrGetGroupLoading].some((item) => item)
    const isError = [errorAddOrGetGroup, isErrorSave, isErrorSend, isErrorAttributeProfile].some((item) => item)
    const errorMessages = getErrorTranslateKeys([errorAddOrGetGroup, errorSend, errorSave].map((item) => item as { message: string }))

    return (
        <RequestListPermissionsWrapper>
            <View
                workingLanguage={workingLanguage}
                isError={isError}
                errorMessages={errorMessages}
                isLoading={isLoading}
                isLoadingMutation={isLoadingMutation}
                firstNotUsedCode={firstNotUsedCode?.code}
                onHandleCheckIfCodeIsAvailable={handleCheckIfCodeIsAvailable}
                loadOptions={loadOptions}
                onSave={onSave}
                onSend={onSend}
                attributeProfile={attributeProfile ?? {}}
                canEdit
            />
        </RequestListPermissionsWrapper>
    )
}
