import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, HierarchyPOFilterUi, useReadCiList } from '@isdd/metais-common/api'
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
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { CreateRequestViewProps } from '@/components/containers/CreateRequestContainer'
import { IItemDates } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { IRequestForm, _entityName, getUUID, mapFormToSave, mapToForm } from '@/componentHelpers/requests'

interface EditRequestContainerProps {
    View: React.FC<CreateRequestViewProps>
}

export const EditRequestContainer: React.FC<EditRequestContainerProps> = ({ View }) => {
    const user = useAuth()
    const { i18n } = useTranslation()
    const { requestId } = useParams()
    const navigate = useNavigate()

    const checkHook = useExistsCodelistHook()
    const setItemsDatesHook = useProcessItemRequestAction1Hook()
    const saaveDatesHook = useSaveDatesHook()
    const { setIsActionSuccess } = useActionSuccess()

    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [isErrorCheck, setErrorCheck] = useState<boolean>()
    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    const implicitHierarchy = useReadCiList()
    const { data, isLoading: isLoadingDetail, isError: isErrorDetail } = useGetCodelistRequestDetail(Number.parseInt(requestId || ''))
    const { mutateAsync, isLoading: isLoadingSave, isError: isErrorSave } = useCreateCodelistRequest()
    const { mutateAsync: mutateSendASync, isLoading: isLoadingSend, isError: isErrorSend } = useSaveAndSendCodelist()
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

    const handleCheckIfCodeListExist = useCallback(
        async (code: string) => {
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
        },
        [checkHook],
    )

    const onSave = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.state?.user?.groupData ?? [])
        const mappedData = mapFormToSave(formData, i18n.language, uuid)
        if (
            mappedData.code &&
            (data?.codelistState === RequestListState.ACCEPTED_SZZC || data?.codelistState === RequestListState.KS_ISVS_ACCEPTED)
        ) {
            saaveDatesHook(mappedData.code, [], {
                effectiveFrom: mappedData.effectiveFrom && formatDateForDefaultValue(mappedData.effectiveFrom, 'dd.MM.yyyy'),
                validFrom: mappedData.validFrom && formatDateForDefaultValue(mappedData.validFrom, 'dd.MM.yyyy'),
            })
                .then(() => {
                    setIsActionSuccess({ value: true, path: RouteNames.REQUESTLIST })
                    navigate(`${RouteNames.REQUESTLIST}`)
                })
                .catch(() => {
                    setErrorCheck(true)
                })
        } else {
            mutateAsync({ data: mappedData })
                .then(() => {
                    setIsActionSuccess({ value: true, path: RouteNames.REQUESTLIST })
                    navigate(`${RouteNames.REQUESTLIST}`)
                })
                .catch(() => {
                    setErrorCheck(true)
                })
        }
    }

    const onSend = async (formData: IRequestForm) => {
        const uuid = getUUID(user?.state?.user?.groupData ?? [])
        mutateSendASync({ data: mapFormToSave(formData, i18n.language, uuid) })
            .then(() => {
                setIsActionSuccess({ value: true, path: RouteNames.REQUESTLIST })
                navigate(`${RouteNames.REQUESTLIST}`)
            })
            .catch(() => {
                setErrorCheck(true)
            })
    }

    const onSaveDates = (dates: IItemDates, items: Record<string, IItemForm>) => {
        setItemsDatesHook(
            defaultData.codeListId,
            false,
            {
                effectiveFrom: formatDateForDefaultValue(dates.effectiveFrom, 'dd.MM.yyyy'),
                validFrom: formatDateForDefaultValue(dates.validDate, 'dd.MM.yyyy'),
                itemCodes: Object.values(items).map((i) => i.codeItem),
            },
            { fromIndex: 0, toIndex: Object.keys(items).length },
        )
            .then(() => {
                setIsActionSuccess({ value: true, path: RouteNames.REQUESTLIST })
                navigate(`${RouteNames.REQUESTLIST}`)
            })
            .catch(() => {
                setErrorCheck(true)
            })
    }

    const isLoading = [isLoadingCheck, isLoadingSave, isLoadingSend, isLoadingDetail, isLoadingItemList, isLoadingAttributeProfile].some(
        (item) => item,
    )
    const isError = [isErrorCheck, isErrorSave, isErrorDetail, isErrorSend, isErrorItemList, isErrorAttributeProfile].some((item) => item)

    const canEditDate =
        data &&
        (data.lockedBy === null || data.lockedBy !== user.state.user?.login) &&
        (data.codelistState === RequestListState.DRAFT ||
            data.codelistState === RequestListState.REJECTED ||
            data.codelistState === RequestListState.KS_ISVS_ACCEPTED ||
            data.codelistState === RequestListState.ACCEPTED_SZZC)

    const canEdit = data && (data.lockedBy === null || data.lockedBy === user.state.user?.login) && data.codelistState === RequestListState.DRAFT

    return !isLoading && defaultData ? (
        <RequestListPermissionsWrapper entityName={_entityName}>
            <View
                requestId={requestId}
                entityName={_entityName}
                canEdit={canEdit}
                canEditDate={canEditDate}
                isError={isError}
                isLoading={isLoading}
                firstNotUsedCode={requestId}
                onCheckIfCodeListExist={handleCheckIfCodeListExist}
                loadOptions={loadOptions}
                onSave={onSave}
                onSend={onSend}
                editData={defaultData}
                attributeProfile={attributeProfile ?? {}}
                onSaveDates={onSaveDates}
            />
        </RequestListPermissionsWrapper>
    ) : (
        <></>
    )
}
