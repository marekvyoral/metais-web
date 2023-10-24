/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetCodelistRequestDetail, useGetCodelistRequestItems } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RequestListState } from '@isdd/metais-common/constants'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IRequestForm, _entityName, mapToForm } from '@/componentHelpers/requests'

export interface DetailRequestViewProps {
    data?: IRequestForm
    isLoading: boolean
    isError: boolean
}

interface DetailRequestContainerProps {
    View: React.FC<DetailRequestViewProps>
}

export const DetailRequestContainer: React.FC<DetailRequestContainerProps> = ({ View }) => {
    const user = useAuth()
    const { i18n } = useTranslation()
    const { requestId } = useParams()

    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [isErrorCheck, setErrorCheck] = useState<boolean>()
    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])

    const { data, isLoading: isLoadingDetail, isError: isErrorDetail } = useGetCodelistRequestDetail(Number.parseInt(requestId || ''))
    const { data: attributeProfile, isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const {
        data: itemList,
        isLoading: isLoadingItemList,
        isError: isErrorItemList,
    } = useGetCodelistRequestItems(Number.parseInt(requestId || '0'), {
        language: i18n.language,
        pageNumber: BASE_PAGE_NUMBER,
        perPage: BASE_PAGE_SIZE,
    })

    const defaultData = mapToForm(i18n.language, itemList, data)

    const isLoading = [isLoadingCheck, isLoadingDetail, isLoadingAttributeProfile, isLoadingItemList].some((item) => item)
    const isError = [isErrorCheck, isErrorDetail, isErrorAttributeProfile, isErrorItemList].some((item) => item)

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
            <View data={defaultData} isLoading={false} isError={false} />
        </RequestListPermissionsWrapper>
    ) : (
        <></>
    )
}
