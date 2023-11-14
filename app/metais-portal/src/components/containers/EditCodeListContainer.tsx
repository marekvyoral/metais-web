import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { HierarchyPOFilterUi, HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ApiCodelistPreview,
    useDeleteTemporalCodelistHeader,
    useGetCodelistHeader,
    useGetOriginalCodelistHeader,
    useGetUnlockTemporalCodelistHeader,
    useUpdateAndUnlockTemporalCodelistHeader,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { IEditCodeListForm, mapEditFormDataToCodeList } from '@/componentHelpers'
import { _entityName } from '@/componentHelpers/requests'
import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IOption } from '@/components/views/codeLists/CodeListEditView'

export interface CodeListDetailData {
    codeList?: ApiCodelistPreview
    codeListOriginal?: ApiCodelistPreview
    attributeProfile?: AttributeProfile
    defaultManagers?: IOption[]
}

export interface EditCodeListContainerViewProps {
    entityName: string
    data: CodeListDetailData
    requestId?: string
    isLoading: boolean
    isError: boolean
    handleSave: (formData: IEditCodeListForm) => Promise<void>
    handleRemoveLock: () => void
    handleDiscardChanges: () => void
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

interface EditCodeListContainerContainerProps {
    View: React.FC<EditCodeListContainerViewProps>
}

export const EditCodeListContainerContainer: React.FC<EditCodeListContainerContainerProps> = ({ View }) => {
    const user = useAuth()
    const { i18n } = useTranslation()
    const { id: codeId } = useParams()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    const returnPath = `${RouteNames.CODELISTS}/${codeId}`

    const [defaultManagers, setDefaultManagers] = useState<IOption[]>([])
    const [isErrorCheck, setErrorCheck] = useState<boolean>()

    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])
    const { mutateAsync: mutateAsyncImplicitHierarchy } = useReadCiList()

    const { mutateAsync: mutateAsyncUnlock, isLoading: isLoadingUnlock, isError: isErrorUnlock } = useGetUnlockTemporalCodelistHeader()
    const { mutateAsync: mutateAsyncDiscard, isLoading: isLoadingDiscard, isError: isErrorDiscard } = useDeleteTemporalCodelistHeader()
    const { mutateAsync: mutateAsyncSave, isLoading: isLoadingSave, isError: isErrorSave } = useUpdateAndUnlockTemporalCodelistHeader()
    const canGetGroup = useAddOrGetGroupHook()
    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const { isLoading: isLoadingData, isError: isErrorData, data: codeListData } = useGetCodelistHeader(Number(codeId))
    const {
        isInitialLoading: isLoadingOriginal,
        isError: isErrorOriginal,
        data: codeListOriginalData,
    } = useGetOriginalCodelistHeader(codeListData?.code ?? '', { query: { enabled: !!codeListData } })

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    useEffect(() => {
        if (codeListData) {
            const promises = codeListData.mainCodelistManagers?.map(
                async (i) => await mutateAsyncImplicitHierarchy({ data: { ...defaultFilter, poUUID: i.value?.substring(37) } }),
            )
            const nextGestorPromises = codeListData.codelistManagers?.map(
                async (i) => await mutateAsyncImplicitHierarchy({ data: { ...defaultFilter, poUUID: i.value?.substring(37) } }),
            )
            Promise.all([...(promises || []), ...(nextGestorPromises || [])]).then((data) => {
                const mainManagersResponse = data.map((response) => response.rights || [])
                const mergedManagers = mainManagersResponse.reduce((acc, val) => acc.concat(val), [])
                setDefaultManagers(mergedManagers)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeListData])

    const data = {
        codeList: codeListData,
        codeListOriginal: codeListOriginalData,
        attributeProfile: attributeProfile,
        defaultManagers: defaultManagers,
    }
    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await mutateAsyncImplicitHierarchy({ data: { ...defaultFilter, page, fullTextSearch: searchQuery } })

        return {
            options: options.rights || [],
            hasMore: options.rights?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const handleRemoveLock = () => {
        mutateAsyncUnlock({ code: codeListData?.code ?? '' }).then(() => {
            setIsActionSuccess({ value: true, path: returnPath })
            navigate(returnPath)
        })
    }

    const handleDiscardChanges = () => {
        mutateAsyncDiscard({ code: codeListData?.code ?? '' }).then(() => {
            setIsActionSuccess({ value: true, path: returnPath })
            navigate(returnPath)
        })
    }

    const saveData = (requestData: ApiCodelistPreview) => {
        mutateAsyncSave({ code: codeListData?.code ?? '', data: requestData }).then(() => {
            setIsActionSuccess({ value: true, path: returnPath })
            navigate(returnPath)
        })
    }

    const handleSave = async (formData: IEditCodeListForm) => {
        const normalizedData = mapEditFormDataToCodeList(formData, data.codeList, i18n.language)
        const nextGestors = formData.nextGestor || []
        const mainGestors = [...(formData.mainGestor ?? [])]

        const mainGestorPromises = mainGestors?.map(async (item) =>
            canGetGroup(item?.value?.substring(0, 36) ?? '', item?.value?.substring(37) ?? ''),
        )
        const nextGestorPromises = nextGestors?.map(async (item) =>
            canGetGroup(item?.value?.substring(37) ?? '', item?.value?.substring(0, 36) ?? ''),
        )
        if (nextGestorPromises.length > 0) {
            Promise.all(nextGestorPromises)
                .then(() => {
                    if (mainGestorPromises.length > 0)
                        Promise.all(mainGestorPromises)
                            .then(() => {
                                saveData(normalizedData)
                            })
                            .catch(() => {
                                setErrorCheck(true)
                            })
                    else {
                        saveData(normalizedData)
                    }
                })
                .catch(() => {
                    setErrorCheck(true)
                })
        } else {
            saveData(normalizedData)
        }
    }

    const isLoading = [isLoadingSave, isLoadingUnlock, isLoadingDiscard, isLoadingData, isLoadingOriginal, isLoadingAttributeProfile].some(
        (item) => item,
    )
    const isError = [isErrorSave, isErrorCheck, isErrorDiscard, isErrorUnlock, isErrorOriginal, isErrorData, isErrorAttributeProfile].some(
        (item) => item,
    )

    return (
        <RequestListPermissionsWrapper entityName={_entityName}>
            <View
                data={data}
                isError={isError}
                entityName={_entityName}
                isLoading={isLoading}
                loadOptions={loadOptions}
                handleSave={handleSave}
                handleRemoveLock={handleRemoveLock}
                handleDiscardChanges={handleDiscardChanges}
            />
        </RequestListPermissionsWrapper>
    )
}
