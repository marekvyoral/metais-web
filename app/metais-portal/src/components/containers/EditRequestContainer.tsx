import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, Roles } from '@isdd/metais-common/api/constants'
import { HierarchyPOFilterUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    useCreateCodelistRequest,
    useExistsCodelistHook,
    useGetCodelistRequestDetail,
    useGetCodelistRequestItems,
    useProcessItemRequestAction1Hook,
    useSaveAndSendCodelist,
    useSaveDatesHook,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { RequestListState } from '@isdd/metais-common/constants'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useInvalidateCodeListRequestCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { CreateRequestViewProps } from '@/components/containers/CreateRequestContainer'
import { IItemDates } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { IRequestForm, getUUID, mapFormToSave, mapToForm } from '@/componentHelpers/requests'
import { getErrorTranslateKeys } from '@/componentHelpers/codeList'

interface EditRequestContainerProps {
    View: React.FC<CreateRequestViewProps>
}

export const EditRequestContainer: React.FC<EditRequestContainerProps> = ({ View }) => {
    const {
        state: { user },
    } = useAuth()
    const { i18n } = useTranslation()
    const { requestId } = useParams()
    const navigate = useNavigate()

    const checkHook = useExistsCodelistHook()
    const setItemsDatesHook = useProcessItemRequestAction1Hook()
    const saveDatesHook = useSaveDatesHook()
    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate } = useInvalidateCodeListRequestCache()

    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [errorCheck, setErrorCheck] = useState<{ message: string }>()
    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups
            .filter((group) => group.roles.some((role) => role.roleName === Roles.SZC_HLGES || role.roleName === Roles.SZC_VEDGES))
            .map((group) => ({
                poUUID: group.orgId,
                roles: group.roles
                    .filter((role) => role.roleName === Roles.SZC_HLGES || role.roleName === Roles.SZC_VEDGES)
                    .map((role) => role.roleUuid),
            })),
    }

    const implicitHierarchy = useReadCiList()
    const {
        data,
        isLoading: isLoadingDetail,
        isError: isErrorDetail,
        error: errorDetail,
    } = useGetCodelistRequestDetail(Number.parseInt(requestId || ''))
    const { mutateAsync, isLoading: isLoadingSave, isError: isErrorSave, error: errorSave } = useCreateCodelistRequest()
    const { mutateAsync: mutateSendASync, isLoading: isLoadingSend, isError: isErrorSend, error: errorSend } = useSaveAndSendCodelist()
    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const {
        data: itemList,
        isLoading: isLoadingItemList,
        isError: isErrorItemList,
    } = useGetCodelistRequestItems(Number.parseInt(requestId || '0'), {
        language: i18n.language,
        pageNumber: defaultFilter.page ?? BASE_PAGE_NUMBER,
        perPage: defaultFilter.perpage ?? BASE_PAGE_SIZE,
    })

    const defaultData = mapToForm(i18n.language, itemList, data)

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

    const handleCheckIfCodeIsAvailable = useCallback(
        async (code: string) => {
            setLoadingCheck(true)
            return checkHook({ code: code, id: Number(requestId), codelistState: RequestListState.NEW_REQUEST })
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
        },
        [checkHook, requestId],
    )

    const onSave = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.groupData ?? [])
        const mappedData = mapFormToSave(formData, i18n.language, uuid, data?.id)
        if (
            mappedData.code &&
            (data?.codelistState === RequestListState.ACCEPTED_SZZC || data?.codelistState === RequestListState.KS_ISVS_ACCEPTED)
        ) {
            saveDatesHook(mappedData.code, [], {
                effectiveFrom: mappedData.effectiveFrom && formatDateForDefaultValue(mappedData.effectiveFrom, 'dd.MM.yyyy'),
                validFrom: mappedData.validFrom && formatDateForDefaultValue(mappedData.validFrom, 'dd.MM.yyyy'),
            })
                .then(() => {
                    invalidate(Number(requestId))
                    setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                    navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                })
                .catch((error) => {
                    setErrorCheck(error)
                })
        } else {
            mutateAsync({ data: mappedData })
                .then(() => {
                    invalidate(Number(requestId))
                    setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                    navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                })
                .catch((error) => {
                    setErrorCheck(error)
                })
        }
    }

    const onSend = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.groupData ?? [])
        mutateSendASync({ data: mapFormToSave(formData, i18n.language, uuid, data?.id) })
            .then(() => {
                invalidate(Number(requestId))
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                navigate(`${NavigationSubRoutes.REQUESTLIST}`)
            })
            .catch((error) => {
                setErrorCheck(error)
            })
    }

    const onSaveDates = (dates: IItemDates, items: Record<string, IItemForm>) => {
        setItemsDatesHook(
            defaultData.codeListCode,
            false,
            {
                effectiveFrom: formatDateForDefaultValue(dates.effectiveFrom, 'dd.MM.yyyy'),
                validFrom: formatDateForDefaultValue(dates.validDate, 'dd.MM.yyyy'),
                itemCodes: Object.values(items).map((i) => i.codeItem),
            },
            { fromIndex: 0, toIndex: Object.keys(items).length },
        )
            .then(() => {
                invalidate(Number(requestId))
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                navigate(`${NavigationSubRoutes.REQUESTLIST}`)
            })
            .catch((error) => {
                setErrorCheck(error)
            })
    }

    const isLoading = [isLoadingCheck, isLoadingDetail, isLoadingItemList, isLoadingAttributeProfile].some((item) => item)
    const isLoadingMutation = [isLoadingSave, isLoadingSend].some((item) => item)
    const isError = [errorCheck, isErrorSave, isErrorDetail, isErrorSend, isErrorItemList, isErrorAttributeProfile].some((item) => item)
    const errorMessages = getErrorTranslateKeys([errorDetail, errorCheck, errorSend, errorSave].map((item) => item as { message: string }))

    const canEditDate =
        data &&
        (data.lockedBy === null || data.lockedBy !== user?.login) &&
        (data.codelistState === RequestListState.DRAFT ||
            data.codelistState === RequestListState.REJECTED ||
            data.codelistState === RequestListState.KS_ISVS_ACCEPTED ||
            data.codelistState === RequestListState.ACCEPTED_SZZC)

    const canEdit = data && (data.lockedBy === null || data.lockedBy === user?.login) && data.codelistState === RequestListState.DRAFT

    return (
        <RequestListPermissionsWrapper id={requestId ?? ''}>
            <View
                requestId={requestId}
                canEdit={canEdit}
                canEditDate={canEditDate}
                isError={isError}
                isLoading={isLoading}
                isLoadingMutation={isLoadingMutation}
                errorMessages={errorMessages}
                onHandleCheckIfCodeIsAvailable={handleCheckIfCodeIsAvailable}
                loadOptions={loadOptions}
                onSave={onSave}
                onSend={onSend}
                editData={defaultData}
                attributeProfile={attributeProfile ?? {}}
                onSaveDates={onSaveDates}
            />
        </RequestListPermissionsWrapper>
    )
}
