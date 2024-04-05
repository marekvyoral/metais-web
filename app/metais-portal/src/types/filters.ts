import { GetFOPReferenceRegisters1Muk, GetFOPReferenceRegisters1State } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
export enum DraftsListFilterItems {
    STATE = 'state',
    STATE_CUSTOM = 'stateCustom',
    REQUEST_CHANNEL = 'requestChannel',
    WORK_GROUP_ID = 'workGroupId',
    DRAFT_NAME = 'draftName',
    FROM_DATE = 'fromDate',
    TO_DATE = 'toDate',
    CREATED_BY = 'createdBy',
}

export interface RefRegisterFilter extends IFilterParams {
    isvsUuid?: string
    managerUuid?: string
    registratorUuid?: string
    state?: GetFOPReferenceRegisters1State
    name?: string
    name_en?: string
    muk?: GetFOPReferenceRegisters1Muk
}

export enum RefRegisterFilterItems {
    NAME = 'name',
    ISVS_UUID = 'isvsUuid',
    MANAGER_UUID = 'managerUuid',
    REGISTRATOR_UUID = 'registratorUuid',
    STATE = 'state',
    STATE_CUSTOM = 'stateCustom',
    MUK = 'muk',
}

export enum RefRegisterItemItems {
    ORDER = 'order',
    NAME = 'name',
    GROUP = 'group',
    SUB_GROUP_NAME = 'subGroupName',
    SUBJECT_IDENTIFICATIONS = 'subjectIdentifications',
    REF_ID = 'refID',
    DATA_ELEMENT_REF_ID = 'dataElementRefID',
    NOTE = 'note',
    sourceElementHolders = 'sourceElementHolders',
}

export enum RefRegisterItemItemsFieldNames {
    ORDER = 'order',
    ITEM_NAME = 'itemName',
    GROUP = 'referenceRegisterGroup.groupName',
    SUB_GROUP_NAME = 'referenceRegisterSubGroup.groupName',
    SUBJECT_IDENTIFICATION = 'subjectIdentification',
    REF_ID = 'refID',
    DATA_ELEMENT_REF_ID = 'dataElementRefID',
    NOTE = 'note',
    sourceReferenceHolders = 'sourceReferenceHolders',
}
