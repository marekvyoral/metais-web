import { GetFOPReferenceRegisters1Muk, GetFOPReferenceRegisters1State } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
export enum DraftsListFilterItems {
    STATE = 'state',
    REQUEST_CHANNEL = 'requestChannel',
    WORK_GROUP_ID = 'workGroupId',
    DRAFT_NAME = 'draftName',
    FROM_DATE = 'fromDate',
    TO_DATE = 'toDate',
    CREATED_BY = 'createdBy',
}

export interface RefRegisterFilter extends IFilterParams {
    isvsUuid: string | undefined
    managerUuid: string | undefined
    registratorUuid: string | undefined
    state: GetFOPReferenceRegisters1State | undefined
    muk: GetFOPReferenceRegisters1Muk | undefined
}

export enum RefRegisterFilterItems {
    ISVS_UUID = 'isvsUuid',
    MANAGER_UUID = 'managerUuid',
    REGISTRATOR_UUID = 'registratorUuid',
    STATE = 'state',
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
}
