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

import { IRefRegisterCreateView } from '@/components/views/refregisters/createView/RefRegisterCreateView'

interface IView extends IRefRegisterCreateView {
    isLoading: boolean
    isError: boolean
}
interface ICreateRefRegisterContainer {
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

export const CreateRefRegisterContainer = ({ View }: ICreateRefRegisterContainer) => {
    const { t } = useTranslation()

    const { userInfo } = useUserInfo()
    const userGroupsFilter = {
        filter: {
            metaAttributes: {
                state: ['DRAFT'],
            },
            uuid: userInfo?.groupData.map((group: Group) => group.orgId),
        },
    }

    const { data: userGroupData, isLoading, isError } = useReadCiList1({ ...userGroupsFilter })

    const { data: POData } = useReadCiList1({ ...POFilter })

    const { mutateAsync: saveRefRegAsync, isError: saveMutationIsError, isSuccess: saveMutationIsSuccess } = useCreateReferenceRegister1()
    const { mutateAsync: updateRefRegAsync, isError: updateMutationIsError, isSuccess: updateMutationIsSuccess } = useUpdateReferenceRegister()

    const saveRefRegister = async (formData: ApiReferenceRegister) => {
        await saveRefRegAsync({ data: formData })
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
    const isSuccess = saveMutationIsSuccess || updateMutationIsSuccess || updateContactMutationIsSuccess || updateAccessDataMutationIsSuccess
    const isMutationError = saveMutationIsError || updateMutationIsError || updateContactMutationIsError || updateAccessDataMutationIsError
    return (
        <>
            <MutationFeedback
                success={isSuccess}
                error={isMutationError ? t('feedback.mutationErrorMessage') : undefined}
                successMessage={saveMutationIsSuccess ? t('feedback.mutationCreateSuccessMessage') : undefined}
            />
            <View
                userGroupData={userGroupData}
                isLoading={isLoading}
                isError={isError}
                POData={POData}
                saveRefRegister={saveRefRegister}
                updateRefRegister={updateRefRegister}
                updateContact={updateContact}
                updateAccessData={updateAccessData}
            />
        </>
    )
}
