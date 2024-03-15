import { IOption } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiReferenceRegister, ApiReferenceRegisterItemList } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, AttributeProfile, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'

export interface IDraftsListTable {
    data: {
        draftsList: ApiStandardRequestPreview[] | undefined
        workingGroups: (Group | undefined)[]
    }
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    workingGroupOptions?: IOption<string>[]
}

export interface AttributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
    attributeProfiles: AttributeProfile[] | undefined
    attributes: Attribute[] | undefined
    renamedAttributes: Attribute[] | undefined
}

export interface IRefRegisterView {
    data: {
        referenceRegisterData: ApiReferenceRegister | undefined
        renamedAttributes: Attribute[] | undefined
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
