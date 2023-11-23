import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { HierarchyPOFilterUi, HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    useCreateCodelistRequest,
    useExistsCodelistHook,
    useGetFirstNotUsedCode,
    useSaveAndSendCodelist,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { RequestListState } from '@isdd/metais-common/constants'
import { useNavigate } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useInvalidateCodeListRequestCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { IItemDates } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IOption } from '@/components/views/requestLists/CreateRequestView'
import { IRequestForm, getUUID, mapFormToSave } from '@/componentHelpers/requests'
import { getErrorTranslateKeys } from '@/componentHelpers/codeList'

export interface CreateRequestViewProps {
    requestId?: string
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    errorMessages: string[]
    attributeProfile: AttributeProfile
    canEditDate?: boolean
    canEdit?: boolean
    firstNotUsedCode?: string
    editData?: IRequestForm
    onHandleCheckIfCodeIsAvailable: (code: string) => Promise<{ isAvailable: boolean; errorTranslateKeys: string[] }>
    onGetMainGestor?: (gid: string) => Promise<IOption>
    onSend: (formData: IRequestForm) => Promise<void>
    onSave: (formData: IRequestForm) => Promise<void>
    onSaveDates?: (dates: IItemDates, items: Record<string, IItemForm>) => void
    loadOptions: (
        searchQuery: string,
        additional: { page: number } | undefined,
    ) => Promise<{
        options: HierarchyRightsUi[]
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
    const { i18n } = useTranslation()
    const checkHook = useExistsCodelistHook()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    const addOrGetGroupHook = useAddOrGetGroupHook()
    const { invalidate } = useInvalidateCodeListRequestCache()

    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])
    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [errorCheck, setErrorCheck] = useState<{ message: string }>()
    const implicitHierarchy = useReadCiList()
    const { mutateAsync, isLoading: isLoadingSave, isError: isErrorSave, error: errorSave } = useCreateCodelistRequest()
    const { mutateAsync: mutateSendASync, isLoading: isLoadingSend, isError: isErrorSend, error: errorSend } = useSaveAndSendCodelist()
    const { data: firstNotUsedCode, isLoading: isLoadingGetFirstNotUsedCode } = useGetFirstNotUsedCode({ query: { cacheTime: 0 } })
    const { data: attributeProfile, isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await implicitHierarchy.mutateAsync({ data: { ...defaultFilter, page, fullTextSearch: searchQuery } })

        return {
            options: options.rights || [],
            hasMore: options.rights?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const handleCheckIfCodeIsAvailable = async (code: string) => {
        setLoadingCheck(true)
        return checkHook({ code: code, codelistState: RequestListState.NEW_REQUEST })
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
            .finally(() => {
                setLoadingCheck(false)
            })
    }

    const onSave = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.groupData ?? [])
        const saveData = mapFormToSave(formData, i18n.language, uuid)
        addOrGetGroupHook(uuid, formData?.mainGestor)
            .then(() => {
                mutateAsync({ data: saveData })
                    .then(() => {
                        invalidate()
                        setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                        navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                    })
                    .catch((error) => {
                        setErrorCheck(error)
                    })
            })
            .catch((error) => {
                setErrorCheck(error)
            })
    }

    const onSend = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.groupData ?? [])
        addOrGetGroupHook(uuid, formData?.mainGestor)
            .then(() => {
                mutateSendASync({ data: mapFormToSave(formData, i18n.language, uuid) })
                    .then(() => {
                        invalidate()
                        setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                        navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                    })
                    .catch((error) => {
                        setErrorCheck(error)
                    })
            })
            .catch((error) => {
                setErrorCheck(error)
            })
    }

    const isLoading = [isLoadingCheck, isLoadingGetFirstNotUsedCode, isLoadingAttributeProfile].some((item) => item)
    const isLoadingMutation = [isLoadingSave, isLoadingSend].some((item) => item)
    const isError = [errorCheck, isErrorSave, isErrorSend, isErrorAttributeProfile].some((item) => item)
    const errorMessages = getErrorTranslateKeys([errorCheck, errorSend, errorSave].map((item) => item as { message: string }))

    return (
        <RequestListPermissionsWrapper>
            <View
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
                canEditDate
            />
        </RequestListPermissionsWrapper>
    )
}
