import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ApiReferenceRegister, ApiReferenceRegisterItemList } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IAttributesContainerView } from '@isdd/metais-common/components/containers/AttributesContainer'

export interface IRefRegisterView {
    data: {
        referenceRegisterData: ApiReferenceRegister | undefined
        attributesProps?: IAttributesContainerView
        guiAttributes?: Attribute[]
    }
    isLoading: boolean
    isError: boolean
}

export interface IRefRegisterItemsView {
    data: {
        refRegisterItems: ApiReferenceRegisterItemList | undefined
        referenceRegisterItemAttributes?: Attribute[] | undefined
    }
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    isLoading: boolean
    isError: boolean
}

export enum RefRegisterViewItems {
    ISVS_NAME = 'isvsName',
    ISVS_CODE = 'isvsCode',
    ISVS_REF_ID = 'isvsRefId',
    EFFECTIVE_FROM = 'effectiveFrom',
    EFFECTIVE_TO = 'effectiveTo',
    MANAGER_NAME = 'managerName',
    CONTACT = 'contact',
    REGISTRATOR_NAME = 'registratorName',
    CONTACT_REGISTRATOR = 'contactRegistrator',
    ADDITIONAL_DATA = 'additionalData',
    STATE = 'state',
    CREATOR = 'creator',
    MANAGER = 'manager',
    ISVS_SOURCE = 'isvsSource',
}
