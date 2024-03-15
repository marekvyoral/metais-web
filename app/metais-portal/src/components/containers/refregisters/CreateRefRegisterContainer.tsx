import {
    ApiContact,
    ApiDescription,
    ApiReferenceRegister,
    useCreateReferenceRegister1,
    useUpdateReferenceRegister,
    useUpdateReferenceRegisterAccessData,
    useUpdateReferenceRegisterContact,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useUserInfo } from '@isdd/metais-common/hooks/useUserInfo'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useTranslation } from 'react-i18next'
import { Group } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterCreateView } from '@/components/views/refregisters/createView/RefRegisterCreateView'
import { useRefRegisterHook } from '@/hooks/useRefRegister.hook'

interface IView extends IRefRegisterCreateView {
    guiAttributes: Attribute[]
    referenceRegisterData: ApiReferenceRegister | undefined
    isLoading: boolean
    isError: boolean
}
interface ICreateRefRegisterContainer {
    entityName: string
    entityId?: string
    View: React.FC<IView>
}

const POFilter = {
    sortBy: 'Gen_Profil_nazov',
    sortType: 'ASC',
    filter: {
        type: ['PO'],
        metaAttributes: {
            state: ['APPROVED_BY_OWNER', 'DRAFT'],
        },
        attributes: [
            {
                name: 'EA_Profil_PO_kategoria_osoby',
                filterValue: [
                    {
                        value: 'c_kategoria_osoba.4',
                        equality: 'EQUAL',
                    },
                ],
            },
        ],
    },
}

export const CreateRefRegisterContainer = ({ entityName, entityId, View }: ICreateRefRegisterContainer) => {
    const { t } = useTranslation()

    const { user } = useUserInfo()
    const userGroupsFilter = {
        filter: {
            metaAttributes: {
                state: ['DRAFT'],
            },
            uuid: user?.groupData.map((group: Group) => group.orgId),
        },
    }

    const { referenceRegisterData, guiAttributes, isLoading: isRefLoading, isError: isRefError } = useRefRegisterHook(entityId)
    const { renamedAttributes, isLoading: isAttributesLoading, isError: isAttributesError } = useAttributesHook(entityName)

    const { data: userGroupData, isLoading, isError } = useReadCiList1({ ...userGroupsFilter })

    const { data: POData } = useReadCiList1({ ...POFilter })

    const { mutateAsync: saveRefRegAsync, isError: saveMutationIsError, isSuccess: saveMutationIsSuccess } = useCreateReferenceRegister1()
    const { mutateAsync: updateRefRegAsync, isError: updateMutationIsError, isSuccess: updateMutationIsSuccess } = useUpdateReferenceRegister()

    const saveRefRegister = async (formData: ApiReferenceRegister) => {
        await saveRefRegAsync({
            data: formData,
        })
    }

    const updateRefRegister = async (referenceRegisterUuid: string, formData: ApiReferenceRegister) => {
        await updateRefRegAsync({ referenceRegisterUuid, data: formData })
    }

    const {
        mutateAsync: updateContactAsync,
        isError: updateContactMutationIsError,
        isSuccess: updateContactMutationIsSuccess,
    } = useUpdateReferenceRegisterContact()
    const updateContact = async (referenceRegisterUuid: string, data: ApiContact) => {
        await updateContactAsync({ referenceRegisterUuid, data })
    }

    const {
        mutateAsync: updateAccessDataAsync,
        isError: updateAccessDataMutationIsError,
        isSuccess: updateAccessDataMutationIsSuccess,
    } = useUpdateReferenceRegisterAccessData()
    const updateAccessData = async (referenceRegisterUuid: string, data: ApiDescription) => {
        await updateAccessDataAsync({ referenceRegisterUuid, data })
    }
    const isSuccess = [
        saveMutationIsSuccess,
        updateMutationIsSuccess,
        updateContactMutationIsSuccess,
        updateAccessDataMutationIsSuccess,
        isAttributesLoading,
        isRefLoading,
    ].some((item) => item)
    const isMutationError = [
        saveMutationIsError,
        updateMutationIsError,
        updateContactMutationIsError,
        updateAccessDataMutationIsError,
        isAttributesError,
        isRefError,
    ].some((item) => item)
    return (
        <>
            <MutationFeedback
                success={isSuccess}
                error={isMutationError}
                successMessage={saveMutationIsSuccess ? t('feedback.mutationCreateSuccessMessage') : undefined}
            />
            <View
                userGroupData={userGroupData}
                isLoading={isLoading}
                isError={isError}
                POData={POData}
                referenceRegisterData={referenceRegisterData}
                renamedAttributes={renamedAttributes}
                guiAttributes={guiAttributes}
                saveRefRegister={saveRefRegister}
                updateRefRegister={updateRefRegister}
                updateContact={updateContact}
                updateAccessData={updateAccessData}
            />
        </>
    )
}
