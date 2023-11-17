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

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { IItemDates } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IOption } from '@/components/views/requestLists/CreateRequestView'
import { IRequestForm, _entityName, getUUID, mapFormToSave } from '@/componentHelpers/requests'
import { getErrorTranslateKeys } from '@/componentHelpers/codeList'

export interface CreateRequestViewProps {
    entityName: string
    requestId?: string
    isLoading: boolean
    isError: boolean
    errorMessages: string[]
    attributeProfile: AttributeProfile
    canEditDate?: boolean
    canEdit?: boolean
    firstNotUsedCode?: string
    editData?: IRequestForm
    onCheckIfCodeListExist: (code: string) => Promise<void>
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

    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])
    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [errorCheck, setErrorCheck] = useState<{ message: string }>()
    const implicitHierarchy = useReadCiList()
    const { mutateAsync, isLoading: isLoadingSave, isError: isErrorSave, error: errorSave } = useCreateCodelistRequest()
    const { mutateAsync: mutateSendASync, isLoading: isLoadingSend, isError: isErrorSend, error: errorSend } = useSaveAndSendCodelist()
    const {
        data: firstNotUsedCode,
        isLoading: isLoadingGetFirstNotUsedCode,
        isError: isErrorGetFirstNotUsedCode,
        error: errorFirstNotUsed,
    } = useGetFirstNotUsedCode()
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

    const handleCheckIfCodeListExist = async (code: string) => {
        setLoadingCheck(true)
        setErrorCheck(undefined)
        await checkHook({ code: code, codelistState: RequestListState.NEW_REQUEST })
            .then(() => {
                return
            })
            .catch((error) => {
                setErrorCheck(error)
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

    const isLoading = [isLoadingCheck, isLoadingSave, isLoadingSend, isLoadingGetFirstNotUsedCode, isLoadingAttributeProfile].some((item) => item)
    const isError = [errorCheck, isErrorSave, isErrorSend, isErrorGetFirstNotUsedCode, isErrorAttributeProfile].some((item) => item)
    const errorMessages = getErrorTranslateKeys([errorCheck, errorFirstNotUsed, errorSend, errorSave].map((item) => item as { message: string }))

    return (
        <RequestListPermissionsWrapper entityName={_entityName}>
            <View
                isError={isError}
                errorMessages={errorMessages}
                entityName={_entityName}
                isLoading={isLoading}
                firstNotUsedCode={firstNotUsedCode?.code}
                onCheckIfCodeListExist={handleCheckIfCodeListExist}
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
