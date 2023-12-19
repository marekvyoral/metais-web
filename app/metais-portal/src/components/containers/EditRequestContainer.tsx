import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { Roles } from '@isdd/metais-common/api/constants'
import { HierarchyPOFilterUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    useCreateCodelistRequest,
    useExistsCodelist,
    useGetCodelistRequestDetail,
    useGetCodelistRequestItems,
    useProcessItemRequestAction1,
    useSaveAndSendCodelist,
    useSaveDates,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useCallback, useMemo } from 'react'
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

    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate } = useInvalidateCodeListRequestCache()

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
    const { mutateAsync: mutateSaveDates, isLoading: isLoadingSaveDates, isError: isErrorSaveDates, error: errorSaveDates } = useSaveDates()
    const {
        mutateAsync: mutateItemAction,
        isLoading: isLoadingItemAction,
        isError: isErrorItemAction,
        error: errorItemAction,
    } = useProcessItemRequestAction1()
    const { mutateAsync: mutateExists, isLoading: isLoadingExists } = useExistsCodelist()

    const {
        data: itemList,
        refetch: refetchItemList,
        isLoading: isLoadingItemList,
        isError: isErrorItemList,
    } = useGetCodelistRequestItems(Number(requestId || '0'), {
        language: i18n.language,
        pageNumber: 1,
        perPage: 99999,
    })

    const defaultData = mapToForm(i18n.language, itemList, data)

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await implicitHierarchy.mutateAsync({ data: { ...defaultFilter, page, fullTextSearch: searchQuery } })
        return {
            options:
                options.rights?.map((item) => ({
                    name: item.poName || '',
                    value: `${getUUID(user?.groupData ?? [])}-${item.poUUID || ''}`,
                })) || [],
            hasMore: options.rights?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const handleCheckIfCodeIsAvailable = useCallback(
        async (code: string) => {
            return mutateExists({ data: { code, id: Number(requestId), codelistState: RequestListState.NEW_REQUEST } })
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
        },
        [mutateExists, requestId],
    )

    const onSave = async (formData: IRequestForm) => {
        const mappedData = mapFormToSave(formData, i18n.language, data?.id)
        const redirectPath = `${NavigationSubRoutes.REQUESTLIST}/${mappedData.id}`
        if (
            mappedData.code &&
            (data?.codelistState === RequestListState.ACCEPTED_SZZC || data?.codelistState === RequestListState.KS_ISVS_ACCEPTED)
        ) {
            mutateSaveDates({
                code: mappedData.code,
                data: [],
                params: {
                    ...(mappedData.effectiveFrom && {
                        effectiveFrom: mappedData.effectiveFrom && formatDateForDefaultValue(mappedData.effectiveFrom, 'dd.MM.yyyy'),
                    }),
                    ...(mappedData.validFrom && { validFrom: mappedData.validFrom && formatDateForDefaultValue(mappedData.validFrom, 'dd.MM.yyyy') }),
                },
            }).then(() => {
                invalidate(Number(requestId))
                setIsActionSuccess({ value: true, path: redirectPath, additionalInfo: { messageKey: 'mutationFeedback.successfulUpdated' } })
                navigate(redirectPath)
            })
        } else {
            mutateAsync({ data: mappedData }).then(() => {
                invalidate(Number(requestId))
                setIsActionSuccess({ value: true, path: redirectPath, additionalInfo: { messageKey: 'mutationFeedback.successfulUpdated' } })
                navigate(redirectPath)
            })
        }
    }

    const onSend = async (formData: IRequestForm) => {
        mutateSendASync({ data: mapFormToSave(formData, i18n.language, data?.id) }).then(() => {
            invalidate(Number(requestId))
            setIsActionSuccess({
                value: true,
                path: NavigationSubRoutes.REQUESTLIST,
                additionalInfo: { messageKey: 'mutationFeedback.successfulUpdated' },
            })
            navigate(`${NavigationSubRoutes.REQUESTLIST}`)
        })
    }

    const onSaveDates = (dates: IItemDates, items: Record<string, IItemForm>) => {
        mutateItemAction({
            code: defaultData.codeListCode,
            allCodelistItems: false,
            data: {
                effectiveFrom: formatDateForDefaultValue(dates.effectiveFrom.toISOString(), 'dd.MM.yyyy'),
                validFrom: formatDateForDefaultValue(dates.validDate.toISOString(), 'dd.MM.yyyy'),
                itemCodes: Object.values(items).map((i) => i.codeItem),
            },
            params: { fromIndex: 0, toIndex: Object.keys(items).length },
        }).then(() => {
            setIsActionSuccess({
                value: true,
                path: `${NavigationSubRoutes.REQUESTLIST}/${requestId}/edit`,
                additionalInfo: { messageKey: 'mutationFeedback.successfulUpdated' },
            })
            refetchItemList()
        })
    }

    const isLoading = [isLoadingDetail, isLoadingItemList, isLoadingAttributeProfile].some((item) => item)
    const isLoadingMutation = [isLoadingSave, isLoadingSend, isLoadingSaveDates, isLoadingItemAction, isLoadingExists].some((item) => item)
    const isError = [isErrorSave, isErrorDetail, isErrorSend, isErrorItemList, isErrorAttributeProfile, isErrorSaveDates, isErrorItemAction].some(
        (item) => item,
    )
    const errorMessages = getErrorTranslateKeys(
        [errorDetail, errorSend, errorSave, errorSaveDates, errorItemAction].map((item) => item as { message: string }),
    )
    const canEdit =
        data &&
        (data.lockedBy === null || data.lockedBy === user?.login) &&
        data.codelistState !== RequestListState.KS_ISVS_ACCEPTED &&
        data.codelistState !== RequestListState.ACCEPTED_SZZC

    return (
        <RequestListPermissionsWrapper id={requestId ?? ''}>
            <View
                requestId={requestId}
                canEdit={canEdit}
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
