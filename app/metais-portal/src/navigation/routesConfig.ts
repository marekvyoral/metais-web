import { FooterRouteNames, LoginRouteNames, RouterRoutes, SLARouteNames } from '@isdd/metais-common/navigation/routeNames'
import { lazy } from 'react'

import { RootRouteContainer } from './route-containers/RootRouteContainer'

const TodoPage = lazy(() => import('@/components/views/todo-page/TodoPage').then((module) => ({ default: module.TodoPage })))
const DevTestScreen = lazy(() => import('@/pages/DevTestScreen').then((module) => ({ default: module.DevTestScreen })))
const ForgottenPasswordPage = lazy(() => import('@/pages/ForgottenPasswordPage').then((module) => ({ default: module.ForgottenPasswordPage })))
const Home = lazy(() => import('@/pages/Home').then((module) => ({ default: module.Home })))
const IdentityTermsPage = lazy(() => import('@/pages/IdentityTermsPage').then((module) => ({ default: module.IdentityTermsPage })))
const LoginProblemsPage = lazy(() => import('@/pages/LoginProblemsPage').then((module) => ({ default: module.LoginProblemsPage })))
const AsEntityDetailPage = lazy(() => import('@/pages/ci/AS/[entityId]'))
const CloneASPage = lazy(() => import('@/pages/ci/AS/[entityId]/clone'))
const IntegrationLinkDetailPage = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]').then((module) => ({ default: module.IntegrationLinkDetailPage })),
)
const IntegrationHarmonogram = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]/harmonogram').then((module) => ({ default: module.IntegrationHarmonogram })),
)
const IntegrationLinkHistory = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]/history').then((module) => ({ default: module.IntegrationLinkHistory })),
)
const IntegrationLinkInformation = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]/information').then((module) => ({ default: module.IntegrationLinkInformation })),
)
const IntegrationKsAsList = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]/ksAsList').then((module) => ({ default: module.IntegrationKsAsList })),
)
const IntegrationSubjectsList = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]/subjectsList').then((module) => ({ default: module.IntegrationSubjectsList })),
)
const ProvIntegrationList = lazy(() => import('@/pages/ci/Integracia/list').then((module) => ({ default: module.ProvIntegrationList })))
const KRISListPage = lazy(() => import('@/pages/ci/KRIS'))
const KrisEntityDetailPage = lazy(() => import('@/pages/ci/KRIS/[entityId]'))
const KRISDocumentsListPage = lazy(() => import('@/pages/ci/KRIS/[entityId]/documents'))
const Evaluation = lazy(() => import('@/pages/ci/KRIS/[entityId]/evaluation'))
const Goals = lazy(() => import('@/pages/ci/KRIS/[entityId]/goals'))
const Tasks = lazy(() => import('@/pages/ci/KRIS/[entityId]/tasks'))
const KsEntityDetailPage = lazy(() => import('@/pages/ci/KS/[entityId]'))
const SlaContractDetailPage = lazy(() => import('@/pages/ci/Kontrakt/[entityId]').then((module) => ({ default: module.SlaContractDetailPage })))
const SlaContractHistory = lazy(() => import('@/pages/ci/Kontrakt/[entityId]/history').then((module) => ({ default: module.SlaContractHistory })))
const SlaContractInformation = lazy(() =>
    import('@/pages/ci/Kontrakt/[entityId]/information').then((module) => ({ default: module.SlaContractInformation })),
)
const SlaContractSupportContact = lazy(() =>
    import('@/pages/ci/Kontrakt/[entityId]/supportContact').then((module) => ({ default: module.SlaContractSupportContact })),
)
const POIsListPage = lazy(() => import('@/pages/ci/PO_IS'))
const POIsPOListPage = lazy(() => import('@/pages/ci/PO_IS_PO'))
const POPOListPage = lazy(() => import('@/pages/ci/PO_PO'))
const PrincipleEntityDetailPage = lazy(() => import('@/pages/ci/Princip/[entityId]'))
const ProjectEntityDetailPage = lazy(() => import('@/pages/ci/Projekt/[entityId]'))
const ActivitiesListPage = lazy(() => import('@/pages/ci/Projekt/[entityId]/activities'))
const ProjectDocumentsListPage = lazy(() => import('@/pages/ci/Projekt/[entityId]/documents'))
const TrainingEntityDetailPage = lazy(() => import('@/pages/ci/Trainings/[entityId]'))
const TrainingInvitePage = lazy(() => import('@/pages/ci/Trainings/[entityId]/invite'))
const EntityDetailPage = lazy(() => import('@/pages/ci/[entityName]/[entityId]'))
const DocumentsListPage = lazy(() => import('@/pages/ci/[entityName]/[entityId]/documents'))
const EditEntityPage = lazy(() => import('@/pages/ci/[entityName]/[entityId]/edit'))
const History = lazy(() => import('@/pages/ci/[entityName]/[entityId]/history'))
const CompareSinglePage = lazy(() => import('@/pages/ci/[entityName]/[entityId]/history/[firstId]'))
const ComparePage = lazy(() => import('@/pages/ci/[entityName]/[entityId]/history/[firstId]/[secondId]'))
const Information = lazy(() => import('@/pages/ci/[entityName]/[entityId]/information'))
const CreateCiItemAndRelation = lazy(() => import('@/pages/ci/[entityName]/[entityId]/new-ci/[tabName]'))
const NewCiRelationPage = lazy(() => import('@/pages/ci/[entityName]/[entityId]/new-relation/[tabName]'))
const RelationshipsAccordionPage = lazy(() => import('@/pages/ci/[entityName]/[entityId]/relationships'))
const CreateKrisEntityPage = lazy(() => import('@/pages/ci/KRIS/create'))
const CreateEntityPage = lazy(() => import('@/pages/ci/[entityName]/create'))
const CiListPage = lazy(() => import('@/pages/ci/[entityName]/entity'))
const CodeListDetailPage = lazy(() => import('@/pages/data-objects/codelists/[id]/detail'))
const EditCodeListPage = lazy(() => import('@/pages/data-objects/codelists/[id]/edit'))
const CodeListPage = lazy(() => import('@/pages/data-objects/codelists/list'))
const RefIdentifiersPage = lazy(() => import('@/pages/data-objects/ref-identifiers'))
const RequestListDetailPage = lazy(() => import('@/pages/data-objects/requestlist/[requestId]/detail'))
const RequestListEditPage = lazy(() => import('@/pages/data-objects/requestlist/[requestId]/edit'))
const RequestListCreatePage = lazy(() => import('@/pages/data-objects/requestlist/create'))
const RequestListPage = lazy(() => import('@/pages/data-objects/requestlist/requestList'))
const GlobalSearchPage = lazy(() => import('@/pages/global/search/search'))
const TutorialPage = lazy(() => import('@/pages/help'))
const GeneralHowTo = lazy(() => import('@/pages/howto'))
const NotificationsPage = lazy(() => import('@/pages/notifications'))
const NotificationsDetailPage = lazy(() => import('@/pages/notifications/[id]'))
const OlaContractList = lazy(() => import('@/pages/ola-contract-list').then((module) => ({ default: module.OlaContractList })))
const PublicAuthoritiesHierarchyPage = lazy(() => import('@/pages/public-authorities-hierarchy'))
const ITVSStandards = lazy(() => import('@/pages/publicspace'))
const RefRegistersDetail = lazy(() => import('@/pages/refregisters/[entityId]'))
const RefRegistersEdit = lazy(() => import('@/pages/refregisters/[entityId]/edit'))
const RefRegistersHistory = lazy(() => import('@/pages/refregisters/[entityId]/history'))
const RefRegistersCompareSinglePage = lazy(() => import('@/pages/refregisters/[entityId]/history/[firstId]'))
const RefRegistersComparePage = lazy(() => import('@/pages/refregisters/[entityId]/history/[firstId]/[secondId]'))
const RefRegistersHistoryChanges = lazy(() => import('@/pages/refregisters/[entityId]/historyChanges'))
const RefRegistersInformation = lazy(() => import('@/pages/refregisters/[entityId]/information'))
const RefRegistersCreate = lazy(() => import('@/pages/refregisters/create'))
const ReferenceRegisters = lazy(() => import('@/pages/refregisters/refRegisterList'))
const Failed = lazy(() => import('@/pages/registration/failed'))
const Registration = lazy(() => import('@/pages/registration/registration'))
const Success = lazy(() => import('@/pages/registration/success'))
const RelationDetailPage = lazy(() => import('@/pages/relation/[entityName]/[entityId]/[relationshipId]'))
const ReportsListPage = lazy(() => import('@/pages/reports/reports'))
const SLADetailPage = lazy(() => import('@/pages/sla-detail'))
const DraftsListEditPage = lazy(() => import('@/pages/standardization/draftslist/[entityId]/edit'))
const DraftDetail = lazy(() => import('@/pages/standardization/draftslist/[entityId]/form'))
const DraftsListCreatePage = lazy(() => import('@/pages/standardization/draftslist/create'))
const DraftsListListPage = lazy(() => import('@/pages/standardization/draftslist/list'))
const GroupsListPage = lazy(() => import('@/pages/standardization/groupslist'))
const GroupDetailPage = lazy(() => import('@/pages/standardization/groupslist/[groupId]'))
const GroupEditPage = lazy(() => import('@/pages/standardization/groupslist/[groupId]/edit'))
const CreateGroupPage = lazy(() => import('@/pages/standardization/groupslist/create'))
const MeetingsListPage = lazy(() => import('@/pages/standardization/meetingslist'))
const MeetingDetailPage = lazy(() => import('@/pages/standardization/meetingslist/[meetingId]'))
const MeetingEditPage = lazy(() => import('@/pages/standardization/meetingslist/[meetingId]/edit'))
const CreateMeetingPage = lazy(() => import('@/pages/standardization/meetingslist/create'))
const VotesListPage = lazy(() => import('@/pages/standardization/voteslist'))
const VoteDetailPage = lazy(() => import('@/pages/standardization/voteslist/[voteIdParam]'))
const VoteEditPage = lazy(() => import('@/pages/standardization/voteslist/[voteIdParam]/edit'))
const VoteCreatePage = lazy(() => import('@/pages/standardization/voteslist/create'))
const TasksPage = lazy(() => import('@/pages/ulohy'))
const TaskDetailPage = lazy(() => import('@/pages/ulohy/[taskId]'))
const UserProfilePage = lazy(() => import('@/pages/userprofile/profile'))
const ImportParametersPage = lazy(() => import('@/pages/monitoring/import'))
const DetailServicePage = lazy(() => import('@/pages/monitoring/services/monitoras/[serviceUuid]'))
const InsertServicePage = lazy(() => import('@/pages/monitoring/services/monitoras/insert/[serviceUuid]'))
const CreateITVSExceptionsPage = lazy(() => import('@/pages/ci/OsobitnyPostup/create'))
const ITVSExceptionsEditPage = lazy(() => import('@/pages/ci/OsobitnyPostup/[entityId]/edit'))
const CreateProjectPage = lazy(() => import('@/pages/ci/Projekt/create'))
const EditProjectPage = lazy(() => import('@/pages/ci/Projekt/[entityId]/edit'))
import PO_POEntityDetailPage from '@/pages/ci/PO_PO/[entityId]'
import PO_ISEntityDetailPage from '@/pages/ci/PO_IS/[entityId]'
import PO_IS_POEntityDetailPage from '@/pages/ci/PO_IS_PO/[entityId]'
import PO_POInformationOutlet from '@/pages/ci/PO_PO/[entityId]/information'
import PO_PODocumentsOutlet from '@/pages/ci/PO_PO/[entityId]/documents'
import PO_PORelationshipOutlet from '@/pages/ci/PO_PO/[entityId]/relationships'
import PO_POHistoryOutlet from '@/pages/ci/PO_PO/[entityId]/history'
import PO_ISInformationOutlet from '@/pages/ci/PO_IS/[entityId]/information'
import PO_IS_POInformationOutlet from '@/pages/ci/PO_IS_PO/[entityId]/information'

const HowToMonitoringPage = lazy(() => import('@/pages/howto/monitoringHowTo'))
const HowToGenericPage = lazy(() => import('@/pages/howto/[howToEnumType]'))
const ServicesListPage = lazy(() => import('@/pages/monitoring/services/services'))
const SLAParamsListPage = lazy(() => import('@/pages/sla-params-list/[entityName]'))
const RelationListPage = lazy(() => import('@/pages/relations'))
const SlaContractList = lazy(() => import('@/pages/ci/Kontrakt/list').then((module) => ({ default: module.SlaContractList })))
const OlaContractAdd = lazy(() => import('@/pages/ola-contract-list/add').then((module) => ({ default: module.OlaContractAdd })))
const OlaContractDetail = lazy(() => import('@/pages/ola-contract-list/detail').then((module) => ({ default: module.OlaContractDetail })))
const OlaContractEdit = lazy(() => import('@/pages/ola-contract-list/edit').then((module) => ({ default: module.OlaContractEdit })))
const IntegrationLinkCreate = lazy(() => import('@/pages/ci/Integracia/create').then((module) => ({ default: module.IntegrationLinkCreate })))
const EditIntegrationLinkPage = lazy(() =>
    import('@/pages/ci/Integracia/[entityId]/edit').then((module) => ({ default: module.EditIntegrationLinkPage })),
)
const RefIdentifierDetailPage = lazy(() => import('@/pages/data-objects/ref-identifiers/[id]/detail'))
const RefIdentifierCreatePage = lazy(() => import('@/pages/data-objects/ref-identifiers/create'))
const RefIdentifierEditPage = lazy(() => import('@/pages/data-objects/ref-identifiers/[id]/edit'))
const CloneKSPage = lazy(() => import('@/pages/ci/KS/[entityId]/clone'))
const PersonalDataInfoPage = lazy(() => import('@/pages/cookies/personalDataProtection'))
const TermsOfUse = lazy(() => import('@/pages/cookies/termsOfUse'))
const CookiesSettings = lazy(() => import('@/pages/cookies/settings'))
const ReportsDetailPage = lazy(() => import('@/pages/reports/[entityId]/report').then((module) => ({ default: module.ReportsDetailPage })))
const CookiesInfoPage = lazy(() => import('@/pages/cookies/info'))
const DeclarationPage = lazy(() => import('@/pages/technical/declaration'))
const CreateTrainingEntityPage = lazy(() => import('@/pages/ci/Trainings/create'))
const EditTrainingEntityPage = lazy(() => import('@/pages/ci/Trainings/[entityId]/edit'))
const AboutApplicationPage = lazy(() => import('@/pages/about-application/aboutApp'))
const TrainingInformation = lazy(() => import('@/pages/ci/Trainings/[entityId]/information'))
const ITVSExceptionsInformation = lazy(() => import('@/pages/ci/OsobitnyPostup/[entityId]/information'))
const GroupItvsDetailPage = lazy(() => import('@/pages/standardization/groupslist/itvs'))
const GroupEditItvsPage = lazy(() => import('@/pages/standardization/groupslist/itvs/edit'))
const ReferenceRegisterDetail = lazy(() => import('@/pages/ci/ReferenceRegister'))
const WebPortalInformation = lazy(() => import('@/pages/ci/WeboveSidlo/[entityId]/information'))
const BulkListPage = lazy(() => import('@/pages/bulk-list/BulkList').then((module) => ({ default: module.BulkListPage })))
const MiestoPrevadzkyEntityDetailPage = lazy(() => import('@/pages/ci/MiestoPrevadzky'))

export interface RouteConfig {
    path?: string
    component: React.FC
    slug?: string
    index?: boolean
    subRoutes?: RouteConfig[]
}

const PO_POInfoOutlet: RouteConfig = {
    slug: RouterRoutes.CI_PO_PO_DETAIL,
    component: PO_POInformationOutlet,
    index: true,
}
const PO_ISInfoOutlet: RouteConfig = {
    slug: RouterRoutes.CI_PO_IS_DETAIL,
    component: PO_ISInformationOutlet,
    index: true,
}
const PO_IS_POInfoOutlet: RouteConfig = {
    slug: RouterRoutes.CI_PO_IS_PO_DETAIL,
    component: PO_IS_POInformationOutlet,
    index: true,
}

const POOutlets: RouteConfig[] = [
    {
        path: RouterRoutes.DOCUMENTS_OUTLET,
        slug: RouterRoutes.DOCUMENTS_OUTLET,
        component: PO_PODocumentsOutlet,
    },
    {
        path: RouterRoutes.RELATIONSHIPS_OUTLET,
        slug: RouterRoutes.RELATIONSHIPS_OUTLET,
        component: PO_PORelationshipOutlet,
    },
    {
        path: RouterRoutes.HISTORY_OUTLET,
        slug: RouterRoutes.HISTORY_OUTLET,
        component: PO_POHistoryOutlet,
    },
]

const generalCiDetailInformationOutlet: RouteConfig = {
    slug: RouterRoutes.CI_DETAIL,
    component: Information,
    index: true,
}

const generalCiDetailOutlets: RouteConfig[] = [
    generalCiDetailInformationOutlet,
    {
        path: RouterRoutes.DOCUMENTS_OUTLET,
        slug: RouterRoutes.DOCUMENTS_OUTLET,
        component: DocumentsListPage,
    },
    {
        path: RouterRoutes.RELATIONSHIPS_OUTLET,
        slug: RouterRoutes.RELATIONSHIPS_OUTLET,
        component: RelationshipsAccordionPage,
    },
    {
        path: RouterRoutes.HISTORY_OUTLET,
        slug: RouterRoutes.HISTORY_OUTLET,
        component: History,
    },
]

const generalCiRoutes: RouteConfig[] = [
    {
        path: RouterRoutes.CI_LIST,
        slug: RouterRoutes.CI_LIST,
        component: CiListPage,
    },
    {
        path: RouterRoutes.CI_CREATE,
        slug: RouterRoutes.CI_CREATE,
        component: CreateEntityPage,
    },
    {
        path: RouterRoutes.CI_EDIT,
        slug: RouterRoutes.CI_EDIT,
        component: EditEntityPage,
    },
    {
        path: RouterRoutes.CI_AS_CLONE,
        slug: RouterRoutes.CI_AS_CLONE,
        component: CloneASPage,
    },
    {
        path: RouterRoutes.CI_KS_CLONE,
        slug: RouterRoutes.CI_KS_CLONE,
        component: CloneKSPage,
    },
    {
        path: RouterRoutes.CI_DETAIL,
        slug: RouterRoutes.CI_DETAIL,
        component: EntityDetailPage,
        subRoutes: generalCiDetailOutlets,
    },
    {
        path: RouterRoutes.HISTORY_COMPARE_SINGLE_ITEM,
        slug: RouterRoutes.HISTORY_COMPARE_SINGLE_ITEM,
        component: CompareSinglePage,
    },
    {
        path: RouterRoutes.HISTORY_COMPARE_TWO_ITEMS,
        slug: RouterRoutes.HISTORY_COMPARE_TWO_ITEMS,
        component: ComparePage,
    },
    {
        path: RouterRoutes.CI_CREATE_ITEM_RELATION,
        slug: RouterRoutes.CI_CREATE_ITEM_RELATION,
        component: CreateCiItemAndRelation,
    },
    {
        path: RouterRoutes.CI_CREATE_RELATION,
        slug: RouterRoutes.CI_CREATE_RELATION,
        component: NewCiRelationPage,
    },
]

export const routesConfig: RouteConfig[] = [
    {
        slug: RouterRoutes.HOME,
        path: RouterRoutes.HOME,
        component: RootRouteContainer,
        subRoutes: [
            {
                index: true,
                component: Home,
            },
            {
                path: RouterRoutes.IDENTITY_TERMS,
                slug: RouterRoutes.IDENTITY_TERMS,
                component: IdentityTermsPage,
            },
            {
                path: RouterRoutes.DEV_TEST_SCREEN,
                slug: RouterRoutes.DEV_TEST_SCREEN,
                component: DevTestScreen,
            },
            {
                path: RouterRoutes.USER_PROFILE,
                slug: RouterRoutes.USER_PROFILE,
                component: UserProfilePage,
            },
            {
                path: RouterRoutes.TASKS,
                slug: RouterRoutes.TASKS,
                component: TasksPage,
            },
            {
                path: RouterRoutes.TASK_DETAIL,
                slug: RouterRoutes.TASK_DETAIL,
                component: TaskDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_LIST,
                slug: RouterRoutes.STANDARDIZATION_VOTE_LIST,
                component: VotesListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_VOTE_DETAIL,
                component: VoteDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_DETAIL_EXTERNAL,
                slug: RouterRoutes.STANDARDIZATION_VOTE_DETAIL_EXTERNAL,
                component: VoteDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_DETAIL_EXTERNAL_VETO,
                slug: RouterRoutes.STANDARDIZATION_VOTE_DETAIL_EXTERNAL_VETO,
                component: VoteDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_CREATE,
                slug: RouterRoutes.STANDARDIZATION_VOTE_CREATE,
                component: VoteCreatePage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_EDIT,
                slug: RouterRoutes.STANDARDIZATION_VOTE_EDIT,
                component: VoteEditPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_LIST,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_LIST,
                component: MeetingsListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_DETAIL,
                component: MeetingDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_CREATE,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_CREATE,
                component: CreateMeetingPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_EDIT,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_EDIT,
                component: MeetingEditPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_LIST,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_LIST,
                component: GroupsListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_DETAIL_ITVS,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_DETAIL_ITVS,
                component: GroupItvsDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_DETAIL,
                component: GroupDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_CREATE,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_CREATE,
                component: CreateGroupPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_EDIT_ITVS,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_EDIT_ITVS,
                component: GroupEditItvsPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_EDIT,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_EDIT,
                component: GroupEditPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_LIST,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_LIST,
                component: DraftsListListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_DETAIL,
                component: DraftDetail,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_CREATE,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_CREATE,
                component: DraftsListCreatePage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_EDIT,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_EDIT,
                component: DraftsListEditPage,
            },
            {
                path: RouterRoutes.REPORTS_DETAIL,
                slug: RouterRoutes.REPORTS_DETAIL,
                component: ReportsDetailPage,
            },
            {
                path: RouterRoutes.REPORTS_LIST,
                slug: RouterRoutes.REPORTS_LIST,
                component: ReportsListPage,
            },
            {
                path: RouterRoutes.IMPORT_MONITORING_PARAMETERS,
                slug: RouterRoutes.IMPORT_MONITORING_PARAMETERS,
                component: ImportParametersPage,
            },
            {
                path: RouterRoutes.MONITORING_SERVICES,
                slug: RouterRoutes.MONITORING_SERVICES,
                component: ServicesListPage,
            },
            {
                path: RouterRoutes.MONITORING_DETAIL,
                slug: RouterRoutes.MONITORING_DETAIL,
                component: DetailServicePage,
            },
            {
                path: RouterRoutes.MONITORING_INSERT,
                slug: RouterRoutes.MONITORING_INSERT,
                component: InsertServicePage,
            },
            {
                path: RouterRoutes.REPORTS_CREATE,
                slug: RouterRoutes.REPORTS_CREATE,
                component: DraftsListCreatePage,
            },
            {
                path: RouterRoutes.RELATIONS,
                slug: RouterRoutes.RELATIONS,
                component: RelationDetailPage,
            },
            {
                path: RouterRoutes.REGISTRATION,
                slug: RouterRoutes.REGISTRATION,
                component: Registration,
            },
            {
                path: RouterRoutes.REGISTRATION_SUCCESS,
                slug: RouterRoutes.REGISTRATION_SUCCESS,
                component: Success,
            },
            {
                path: RouterRoutes.REGISTRATION_FAILED,
                slug: RouterRoutes.REGISTRATION_FAILED,
                component: Failed,
            },
            {
                path: RouterRoutes.PUBLIC_SPACE,
                slug: RouterRoutes.PUBLIC_SPACE,
                component: ITVSStandards,
            },
            {
                path: RouterRoutes.PUBLIC_AUTHORITIES_HIERARCHY,
                slug: RouterRoutes.PUBLIC_AUTHORITIES_HIERARCHY,
                component: PublicAuthoritiesHierarchyPage,
            },
            {
                path: RouterRoutes.NOTIFICATIONS,
                slug: RouterRoutes.NOTIFICATIONS,
                component: NotificationsPage,
            },
            {
                path: RouterRoutes.NOTIFICATIONS_DETAIL,
                slug: RouterRoutes.NOTIFICATIONS_DETAIL,
                component: NotificationsDetailPage,
            },
            {
                path: RouterRoutes.NOTIFICATIONS_DETAIL,
                slug: RouterRoutes.NOTIFICATIONS_DETAIL,
                component: NotificationsDetailPage,
            },
            {
                path: RouterRoutes.HOW_TO_GENERAL_PAGE,
                slug: RouterRoutes.HOW_TO_GENERAL_PAGE,
                component: GeneralHowTo,
            },
            {
                path: RouterRoutes.HOW_TO_GENERIC_PAGE,
                slug: RouterRoutes.HOW_TO_GENERIC_PAGE,
                component: HowToGenericPage,
            },
            {
                path: RouterRoutes.HOW_TO_MONITORING_PAGE,
                slug: RouterRoutes.HOW_TO_MONITORING_PAGE,
                component: HowToMonitoringPage,
            },
            {
                path: RouterRoutes.HELP,
                slug: RouterRoutes.HELP,
                component: TutorialPage,
            },
            {
                path: RouterRoutes.GLOBAL_SEARCH,
                slug: RouterRoutes.GLOBAL_SEARCH,
                component: GlobalSearchPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_CODE_LIST,
                slug: RouterRoutes.DATA_OBJECT_CODE_LIST,
                component: CodeListPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_CODE_LIST_DETAIL,
                slug: RouterRoutes.DATA_OBJECT_CODE_LIST_DETAIL,
                component: CodeListDetailPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_CODE_LIST_EDIT,
                slug: RouterRoutes.DATA_OBJECT_CODE_LIST_EDIT,
                component: EditCodeListPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_LIST,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_LIST,
                component: RequestListPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_DETAIL,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_DETAIL,
                component: RequestListDetailPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_EDIT,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_EDIT,
                component: RequestListEditPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_CREATE,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_CREATE,
                component: RequestListCreatePage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS,
                slug: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS,
                component: RefIdentifiersPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_DETAIL,
                slug: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_DETAIL,
                component: RefIdentifierDetailPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_CREATE,
                slug: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_CREATE,
                component: RefIdentifierCreatePage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_EDIT,
                slug: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_EDIT,
                component: RefIdentifierEditPage,
            },
            {
                path: RouterRoutes.REF_REGISTERS_LIST,
                slug: RouterRoutes.REF_REGISTERS_LIST,
                component: ReferenceRegisters,
            },
            {
                path: FooterRouteNames.COOKIES,
                slug: FooterRouteNames.COOKIES,
                component: CookiesInfoPage,
            },
            {
                path: FooterRouteNames.ACCESSIBILITY_DECLARATION,
                slug: FooterRouteNames.ACCESSIBILITY_DECLARATION,
                component: DeclarationPage,
            },
            {
                path: FooterRouteNames.PERSONAL_DATA_PROTECTION,
                slug: FooterRouteNames.PERSONAL_DATA_PROTECTION,
                component: PersonalDataInfoPage,
            },
            {
                path: FooterRouteNames.TERMS_OF_USE,
                slug: FooterRouteNames.TERMS_OF_USE,
                component: TermsOfUse,
            },
            {
                path: FooterRouteNames.COOKIES_SETTINGS,
                slug: FooterRouteNames.COOKIES_SETTINGS,
                component: CookiesSettings,
            },
            {
                path: FooterRouteNames.ABOUT_APPLICATION,
                slug: FooterRouteNames.ABOUT_APPLICATION,
                component: AboutApplicationPage,
            },
            {
                path: RouterRoutes.CI_REFERENCE_REGISTER,
                slug: RouterRoutes.CI_REFERENCE_REGISTER,
                component: ReferenceRegisterDetail,
            },
            {
                path: RouterRoutes.CI_MIESTO_PREVADZKY,
                slug: RouterRoutes.CI_MIESTO_PREVADZKY,
                component: MiestoPrevadzkyEntityDetailPage,
            },
            {
                path: RouterRoutes.REF_REGISTERS_DETAIL,
                slug: RouterRoutes.REF_REGISTERS_DETAIL,
                component: RefRegistersDetail,
                subRoutes: [
                    {
                        slug: RouterRoutes.REF_REGISTERS_DETAIL,
                        component: RefRegistersInformation,
                        index: true,
                    },
                    {
                        path: RouterRoutes.HISTORY_CHANGES_OUTLET,
                        slug: RouterRoutes.HISTORY_CHANGES_OUTLET,
                        component: RefRegistersHistoryChanges,
                    },
                    {
                        path: RouterRoutes.HISTORY_OUTLET,
                        slug: RouterRoutes.HISTORY_OUTLET,
                        component: RefRegistersHistory,
                    },
                ],
            },
            {
                path: RouterRoutes.REF_REGISTERS_CREATE,
                slug: RouterRoutes.REF_REGISTERS_CREATE,
                component: RefRegistersCreate,
            },
            {
                path: RouterRoutes.REF_REGISTERS_EDIT,
                slug: RouterRoutes.REF_REGISTERS_EDIT,
                component: RefRegistersEdit,
            },
            {
                path: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_SINGLE_ITEM,
                slug: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_SINGLE_ITEM,
                component: RefRegistersCompareSinglePage,
            },
            {
                path: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_TWO_ITEMS,
                slug: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_TWO_ITEMS,
                component: RefRegistersComparePage,
            },
            {
                path: RouterRoutes.CI_PO_IS,
                slug: RouterRoutes.CI_PO_IS,
                component: POIsListPage,
            },
            {
                path: RouterRoutes.CI_PO_IS_PO,
                slug: RouterRoutes.CI_PO_IS_PO,
                component: POIsPOListPage,
            },
            {
                path: RouterRoutes.CI_PO_PO,
                slug: RouterRoutes.CI_PO_PO,
                component: POPOListPage,
            },
            {
                path: RouterRoutes.CI_PO_PO_DETAIL,
                slug: RouterRoutes.CI_PO_PO_DETAIL,
                component: PO_POEntityDetailPage,
                subRoutes: [PO_POInfoOutlet, ...POOutlets],
            },
            {
                path: RouterRoutes.CI_PO_IS_DETAIL,
                slug: RouterRoutes.CI_PO_IS_DETAIL,
                component: PO_ISEntityDetailPage,
                subRoutes: [PO_ISInfoOutlet, ...POOutlets],
            },
            {
                path: RouterRoutes.CI_PO_IS_PO_DETAIL,
                slug: RouterRoutes.CI_PO_IS_PO_DETAIL,
                component: PO_IS_POEntityDetailPage,
                subRoutes: [PO_IS_POInfoOutlet, ...POOutlets],
            },
            {
                path: RouterRoutes.CI_PRINCIPLE_DETAIL,
                slug: RouterRoutes.CI_PRINCIPLE_DETAIL,
                component: PrincipleEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_PRINCIPLE_CREATE,
                slug: RouterRoutes.CI_PRINCIPLE_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_TRAINING_DETAIL,
                slug: RouterRoutes.CI_TRAINING_DETAIL,
                component: TrainingEntityDetailPage,
                subRoutes: [
                    {
                        slug: RouterRoutes.CI_DETAIL,
                        component: TrainingInformation,
                        index: true,
                    },
                ],
            },
            {
                path: RouterRoutes.CI_TRAINING_CREATE,
                slug: RouterRoutes.CI_TRAINING_CREATE,
                component: CreateTrainingEntityPage,
            },
            {
                path: RouterRoutes.CI_TRAINING_EDIT,
                slug: RouterRoutes.CI_TRAINING_EDIT,
                component: EditTrainingEntityPage,
            },
            {
                path: RouterRoutes.CI_TRAINING_INVITE,
                slug: RouterRoutes.CI_TRAINING_INVITE,
                component: TrainingInvitePage,
            },
            {
                path: RouterRoutes.CI_KRIS_LIST,
                slug: RouterRoutes.CI_KRIS_LIST,
                component: KRISListPage,
            },
            {
                path: RouterRoutes.CI_KRIS_DETAIL,
                slug: RouterRoutes.CI_KRIS_DETAIL,
                component: KrisEntityDetailPage,
                subRoutes: [
                    {
                        path: RouterRoutes.DOCUMENTS_OUTLET,
                        slug: RouterRoutes.DOCUMENTS_OUTLET,
                        component: KRISDocumentsListPage,
                    },
                    ...generalCiDetailOutlets,
                    {
                        path: RouterRoutes.GOALS_OUTLET,
                        slug: RouterRoutes.GOALS_OUTLET,
                        component: Goals,
                    },
                    ...generalCiDetailOutlets,
                    {
                        path: RouterRoutes.TASKS_OUTLET,
                        slug: RouterRoutes.TASKS_OUTLET,
                        component: Tasks,
                    },
                    ...generalCiDetailOutlets,
                    {
                        path: RouterRoutes.EVALUATION_OUTLET,
                        slug: RouterRoutes.EVALUATION_OUTLET,
                        component: Evaluation,
                    },
                ],
            },
            {
                path: RouterRoutes.CI_KRIS_CREATE,
                slug: RouterRoutes.CI_KRIS_CREATE,
                component: CreateKrisEntityPage,
            },
            {
                path: RouterRoutes.CI_PROJECT_DETAIL,
                slug: RouterRoutes.CI_PROJECT_DETAIL,
                component: ProjectEntityDetailPage,
                subRoutes: [
                    ...generalCiDetailOutlets.filter((outlet) => outlet.path !== RouterRoutes.DOCUMENTS_OUTLET),
                    {
                        path: RouterRoutes.ACTIVITIES_OUTLET,
                        slug: RouterRoutes.ACTIVITIES_OUTLET,
                        component: ActivitiesListPage,
                    },
                    {
                        path: RouterRoutes.DOCUMENTS_OUTLET,
                        slug: RouterRoutes.DOCUMENTS_OUTLET,
                        component: ProjectDocumentsListPage,
                    },
                ],
            },
            {
                path: RouterRoutes.CI_PROJECT_CREATE,
                slug: RouterRoutes.CI_PROJECT_CREATE,
                component: CreateProjectPage,
            },
            {
                path: RouterRoutes.CI_PROJECT_EDIT,
                slug: RouterRoutes.CI_PROJECT_EDIT,
                component: EditProjectPage,
            },
            {
                path: RouterRoutes.CI_KS_DETAIL,
                slug: RouterRoutes.CI_KS_DETAIL,
                component: KsEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_KS_CREATE,
                slug: RouterRoutes.CI_KS_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_AS_DETAIL,
                slug: RouterRoutes.CI_AS_DETAIL,
                component: AsEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_AS_CREATE,
                slug: RouterRoutes.CI_AS_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.ITVS_EXCEPTIONS_CREATE,
                slug: RouterRoutes.ITVS_EXCEPTIONS_CREATE,
                component: CreateITVSExceptionsPage,
            },
            {
                path: RouterRoutes.ITVS_EXCEPTIONS_DETAIL,
                slug: RouterRoutes.ITVS_EXCEPTIONS_DETAIL,
                component: EntityDetailPage,
                subRoutes: [
                    {
                        slug: RouterRoutes.CI_DETAIL,
                        component: ITVSExceptionsInformation,
                        index: true,
                    },
                ],
            },
            {
                path: RouterRoutes.ITVS_EXCEPTIONS_EDIT,
                slug: RouterRoutes.ITVS_EXCEPTIONS_EDIT,
                component: ITVSExceptionsEditPage,
            },
            {
                path: RouterRoutes.WEBOVE_SIDLO_DETAIL,
                slug: RouterRoutes.WEBOVE_SIDLO_DETAIL,
                component: EntityDetailPage,
                subRoutes: [
                    {
                        slug: RouterRoutes.CI_DETAIL,
                        component: WebPortalInformation,
                        index: true,
                    },
                ],
            },
            {
                path: RouterRoutes.WEBOVE_SIDLO_CREATE,
                slug: RouterRoutes.WEBOVE_SIDLO_CREATE,
                component: CreateEntityPage,
            },
            {
                path: LoginRouteNames.LOGIN_PROBLEMS,
                slug: LoginRouteNames.LOGIN_PROBLEMS,
                component: LoginProblemsPage,
            },
            {
                path: LoginRouteNames.FORGOTTEN_PASSWORD,
                slug: LoginRouteNames.FORGOTTEN_PASSWORD,
                component: ForgottenPasswordPage,
            },
            {
                path: RouterRoutes.INTEGRATION_LIST,
                slug: RouterRoutes.INTEGRATION_LIST,
                component: ProvIntegrationList,
            },
            {
                path: RouterRoutes.INTEGRATION_CREATE,
                slug: RouterRoutes.INTEGRATION_CREATE,
                component: IntegrationLinkCreate,
            },
            {
                path: RouterRoutes.INTEGRATION_EDIT,
                slug: RouterRoutes.INTEGRATION_EDIT,
                component: EditIntegrationLinkPage,
            },

            {
                path: RouterRoutes.INTEGRATION_DETAIL,
                slug: RouterRoutes.INTEGRATION_DETAIL,
                component: IntegrationLinkDetailPage,
                subRoutes: [
                    {
                        slug: RouterRoutes.INTEGRATION_DETAIL,
                        component: IntegrationLinkInformation,
                        index: true,
                    },
                    {
                        path: RouterRoutes.INTEGRATION_KS_AS_OUTLET,
                        slug: RouterRoutes.INTEGRATION_KS_AS_OUTLET,
                        component: IntegrationKsAsList,
                    },
                    {
                        path: RouterRoutes.INTEGRATION_SUBJECTS_LIST_OUTLET,
                        slug: RouterRoutes.INTEGRATION_SUBJECTS_LIST_OUTLET,
                        component: IntegrationSubjectsList,
                    },
                    {
                        path: RouterRoutes.INTEGRATION_HARMONOGRAM_OUTLET,
                        slug: RouterRoutes.INTEGRATION_HARMONOGRAM_OUTLET,
                        component: IntegrationHarmonogram,
                    },
                    {
                        path: RouterRoutes.HISTORY_OUTLET,
                        slug: RouterRoutes.HISTORY_OUTLET,
                        component: IntegrationLinkHistory,
                    },
                ],
            },
            {
                path: RouterRoutes.SLA_CONTRACT_LIST,
                slug: RouterRoutes.SLA_CONTRACT_LIST,
                component: SlaContractList,
            },
            {
                path: RouterRoutes.OLA_CONTRACT_LIST,
                slug: RouterRoutes.OLA_CONTRACT_LIST,
                component: OlaContractList,
            },
            {
                path: RouterRoutes.OLA_CONTRACT_ADD,
                slug: RouterRoutes.OLA_CONTRACT_ADD,
                component: OlaContractAdd,
            },
            {
                path: RouterRoutes.OLA_CONTRACT_DETAIL,
                slug: RouterRoutes.OLA_CONTRACT_DETAIL,
                component: OlaContractDetail,
            },
            {
                path: RouterRoutes.OLA_CONTRACT_EDIT,
                slug: RouterRoutes.OLA_CONTRACT_EDIT,
                component: OlaContractEdit,
            },
            {
                path: RouterRoutes.SLA_CONTRACT_DETAIL,
                slug: RouterRoutes.SLA_CONTRACT_DETAIL,
                component: SlaContractDetailPage,
                subRoutes: [
                    {
                        slug: RouterRoutes.SLA_CONTRACT_DETAIL,
                        component: SlaContractInformation,
                        index: true,
                    },
                    {
                        path: RouterRoutes.SLA_CONTRACT_SUPPORT_CONTACT,
                        slug: RouterRoutes.SLA_CONTRACT_SUPPORT_CONTACT,
                        component: SlaContractSupportContact,
                    },
                    {
                        path: RouterRoutes.SLA_CONTRACT_HISTORY,
                        slug: RouterRoutes.SLA_CONTRACT_HISTORY,
                        component: SlaContractHistory,
                    },
                ],
            },
            ...generalCiRoutes,
            {
                path: SLARouteNames.SLADetail,
                slug: SLARouteNames.SLADetail,
                component: SLADetailPage,
            },
            {
                path: SLARouteNames.SLAParamsList,
                slug: SLARouteNames.SLAParamsList,
                component: SLAParamsListPage,
            },
            {
                path: RouterRoutes.RELATION_LIST,
                slug: RouterRoutes.RELATION_LIST,
                component: RelationListPage,
            },
            {
                path: RouterRoutes.BULK_ACTION_ITEM_LIST,
                slug: RouterRoutes.BULK_ACTION_ITEM_LIST,
                component: BulkListPage,
            },
            {
                path: '*',
                component: TodoPage,
            },
        ],
    },
]
