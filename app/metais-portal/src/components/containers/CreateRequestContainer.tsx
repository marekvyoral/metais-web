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
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { IItemDates } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IOption } from '@/components/views/requestLists/CreateRequestView'
import { IRequestForm, _entityName, getUUID, mapFormToSave } from '@/componentHelpers/requests'

export interface CreateRequestViewProps {
    entityName: string
    requestId?: string
    isLoading: boolean
    isError: boolean
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
    const { userInfo: user } = useAuth()
    const { i18n } = useTranslation()
    const checkHook = useExistsCodelistHook()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    const addOrGetGroupHook = useAddOrGetGroupHook()

    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])
    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [isErrorCheck, setErrorCheck] = useState<boolean>()
    const implicitHierarchy = useReadCiList()
    const { mutateAsync, isLoading: isLoadingSave, isError: isErrorSave } = useCreateCodelistRequest()
    const { mutateAsync: mutateSendASync, isLoading: isLoadingSend, isError: isErrorSend } = useSaveAndSendCodelist()
    const { data: firstNotUsedCode, isLoading: isLoadinfgGetFirstNotUsedCode, isError: isErrorGetFirstNotUsedCode } = useGetFirstNotUsedCode()
    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

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
        setErrorCheck(false)
        await checkHook({ code: code, codelistState: RequestListState.NEW_REQUEST })
            .then(() => {
                return
            })
            .catch(() => {
                setErrorCheck(true)
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
                        setIsActionSuccess({ value: true, path: RouteNames.REQUESTLIST })
                        navigate(`${RouteNames.REQUESTLIST}`)
                    })
                    .catch(() => {
                        setErrorCheck(true)
                    })
            })
            .catch(() => {
                setErrorCheck(true)
            })
    }

    const onSend = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.groupData ?? [])
        addOrGetGroupHook(uuid, formData?.mainGestor)
            .then(() => {
                mutateSendASync({ data: mapFormToSave(formData, i18n.language, uuid) })
                    .then(() => {
                        setIsActionSuccess({ value: true, path: RouteNames.REQUESTLIST })
                        navigate(`${RouteNames.REQUESTLIST}`)
                    })
                    .catch(() => {
                        setErrorCheck(true)
                    })
            })
            .catch(() => {
                setErrorCheck(true)
            })
    }

    const isLoading = [isLoadingCheck, isLoadingSave, isLoadingSend, isLoadinfgGetFirstNotUsedCode, isLoadingAttributeProfile].some((item) => item)
    const isError = [isErrorCheck, isErrorSave, isErrorSend, isErrorGetFirstNotUsedCode, isErrorAttributeProfile].some((item) => item)

    return (
        <RequestListPermissionsWrapper entityName={_entityName}>
            <View
                isError={isError}
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
