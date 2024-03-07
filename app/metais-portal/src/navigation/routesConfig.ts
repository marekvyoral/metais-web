import { FooterRouteNames, LoginRouteNames, RouterRoutes, SLARouteNames } from '@isdd/metais-common/navigation/routeNames'

import { RootRouteContainer } from './route-containers/RootRouteContainer'

import { TodoPage } from '@/components/views/todo-page/TodoPage'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { ForgottenPasswordPage } from '@/pages/ForgottenPasswordPage'
import { Home } from '@/pages/Home'
import { IdentityTermsPage } from '@/pages/IdentityTermsPage'
import { LoginProblemsPage } from '@/pages/LoginProblemsPage'
import AsEntityDetailPage from '@/pages/ci/AS/[entityId]'
import CloneASPage from '@/pages/ci/AS/[entityId]/clone'
import ActivityEntityDetailPage from '@/pages/ci/Aktivita/[entityId]'
import GoalEntityDetailPage from '@/pages/ci/Ciel/[entityId]'
import { IntegrationLinkDetailPage } from '@/pages/ci/Integracia/[entityId]'
import { IntegrationHarmonogram } from '@/pages/ci/Integracia/[entityId]/harmonogram'
import { IntegrationLinkHistory } from '@/pages/ci/Integracia/[entityId]/history'
import { IntegrationLinkInformation } from '@/pages/ci/Integracia/[entityId]/information'
import { IntegrationKsAsList } from '@/pages/ci/Integracia/[entityId]/ksAsList'
import { IntegrationSubjectsList } from '@/pages/ci/Integracia/[entityId]/subjectsList'
import { ProvIntegrationList } from '@/pages/ci/Integracia/list'
import KRISListPage from '@/pages/ci/KRIS'
import KrisEntityDetailPage from '@/pages/ci/KRIS/[entityId]'
import KRISDocumentsListPage from '@/pages/ci/KRIS/[entityId]/documents'
import Evaluation from '@/pages/ci/KRIS/[entityId]/evaluation'
import Goals from '@/pages/ci/KRIS/[entityId]/goals'
import Tasks from '@/pages/ci/KRIS/[entityId]/tasks'
import KsEntityDetailPage from '@/pages/ci/KS/[entityId]'
import { SlaContractDetailPage } from '@/pages/ci/Kontrakt/[entityId]'
import { SlaContractHistory } from '@/pages/ci/Kontrakt/[entityId]/history'
import { SlaContractInformation } from '@/pages/ci/Kontrakt/[entityId]/information'
import { SlaContractSupportContact } from '@/pages/ci/Kontrakt/[entityId]/supportContact'
import POIsListPage from '@/pages/ci/PO_IS'
import POIsPOListPage from '@/pages/ci/PO_IS_PO'
import POPOListPage from '@/pages/ci/PO_PO'
import PrincipleEntityDetailPage from '@/pages/ci/Princip/[entityId]'
import ProjectEntityDetailPage from '@/pages/ci/Projekt/[entityId]'
import ActivitiesListPage from '@/pages/ci/Projekt/[entityId]/activities'
import ProjectDocumentsListPage from '@/pages/ci/Projekt/[entityId]/documents'
import TrainingEntityDetailPage from '@/pages/ci/Trainings/[entityId]'
import TrainingInvitePage from '@/pages/ci/Trainings/[entityId]/invite'
import EntityDetailPage from '@/pages/ci/[entityName]/[entityId]'
import DocumentsListPage from '@/pages/ci/[entityName]/[entityId]/documents'
import EditEntityPage from '@/pages/ci/[entityName]/[entityId]/edit'
import History from '@/pages/ci/[entityName]/[entityId]/history'
import CompareSinglePage from '@/pages/ci/[entityName]/[entityId]/history/[firstId]'
import ComparePage from '@/pages/ci/[entityName]/[entityId]/history/[firstId]/[secondId]'
import Information from '@/pages/ci/[entityName]/[entityId]/information'
import CreateCiItemAndRelation from '@/pages/ci/[entityName]/[entityId]/new-ci/[tabName]'
import NewCiRelationPage from '@/pages/ci/[entityName]/[entityId]/new-relation/[tabName]'
import RelationshipsAccordionPage from '@/pages/ci/[entityName]/[entityId]/relationships'
import CreateEntityPage from '@/pages/ci/[entityName]/create'
import CiListPage from '@/pages/ci/[entityName]/entity'
import CodeListDetailPage from '@/pages/data-objects/codelists/[id]/detail'
import EditCodeListPage from '@/pages/data-objects/codelists/[id]/edit'
import CodeListPage from '@/pages/data-objects/codelists/list'
import RefIdentifiersPage from '@/pages/data-objects/ref-identifiers'
import RequestListDetailPage from '@/pages/data-objects/requestlist/[requestId]/detail'
import RequestListEditPage from '@/pages/data-objects/requestlist/[requestId]/edit'
import RequestListCreatePage from '@/pages/data-objects/requestlist/create'
import RequestListPage from '@/pages/data-objects/requestlist/requestList'
import GlobalSearchPage from '@/pages/global/search/search'
import TutorialPage from '@/pages/help'
import GeneralHowTo from '@/pages/howto'
import NotificationsPage from '@/pages/notifications'
import NotificationsDetailPage from '@/pages/notifications/[id]'
import { OlaContractList } from '@/pages/ola-contract-list'
import PublicAuthoritiesHierarchyPage from '@/pages/public-authorities-hierarchy'
import ITVSStandards from '@/pages/publicspace'
import RefRegistersDetail from '@/pages/refregisters/[entityId]'
import RefRegistersEdit from '@/pages/refregisters/[entityId]/edit'
import RefRegistersHistory from '@/pages/refregisters/[entityId]/history'
import RefRegistersCompareSinglePage from '@/pages/refregisters/[entityId]/history/[firstId]'
import RefRegistersComparePage from '@/pages/refregisters/[entityId]/history/[firstId]/[secondId]'
import RefRegistersHistoryChanges from '@/pages/refregisters/[entityId]/historyChanges'
import RefRegistersInformation from '@/pages/refregisters/[entityId]/information'
import RefRegistersCreate from '@/pages/refregisters/create'
import ReferenceRegisters from '@/pages/refregisters/refRegisterList'
import Failed from '@/pages/registration/failed'
import Registration from '@/pages/registration/registration'
import Success from '@/pages/registration/success'
import RelationDetailPage from '@/pages/relation/[entityName]/[entityId]/[relationshipId]'
import ReportsListPage from '@/pages/reports/reports'
import SLADetailPage from '@/pages/sla-detail'
import DraftsListEditPage from '@/pages/standardization/draftslist/[entityId]/edit'
import DraftDetail from '@/pages/standardization/draftslist/[entityId]/form'
import DraftsListCreatePage from '@/pages/standardization/draftslist/create'
import DraftsListListPage from '@/pages/standardization/draftslist/list'
import GroupsListPage from '@/pages/standardization/groupslist'
import GroupDetailPage from '@/pages/standardization/groupslist/[groupId]'
import GroupEditPage from '@/pages/standardization/groupslist/[groupId]/edit'
import CreateGroupPage from '@/pages/standardization/groupslist/create'
import MeetingsListPage from '@/pages/standardization/meetingslist'
import MeetingDetailPage from '@/pages/standardization/meetingslist/[meetingId]'
import MeetingEditPage from '@/pages/standardization/meetingslist/[meetingId]/edit'
import CreateMeetingPage from '@/pages/standardization/meetingslist/create'
import VotesListPage from '@/pages/standardization/voteslist'
import VoteDetailPage from '@/pages/standardization/voteslist/[voteIdParam]'
import VoteEditPage from '@/pages/standardization/voteslist/[voteIdParam]/edit'
import VoteCreatePage from '@/pages/standardization/voteslist/create'
import TasksPage from '@/pages/ulohy'
import TaskDetailPage from '@/pages/ulohy/[taskId]'
import UserProfilePage from '@/pages/userprofile/profile'
import ImportParametersPage from '@/pages/monitoring/import'
import DetailServicePage from '@/pages/monitoring/services/monitoras/[serviceUuid]'
import InsertServicePage from '@/pages/monitoring/services/monitoras/insert/[serviceUuid]'
import CreateITVSExceptionsPage from '@/pages/ci/OsobitnyPostup/create'
import ITVSExceptionsEditPage from '@/pages/ci/OsobitnyPostup/[entityId]/edit'
import CreateProjectPage from '@/pages/ci/Projekt/create'
import EditProjectPage from '@/pages/ci/Projekt/[entityId]/edit'
import PO_POEntityDetailPage from '@/pages/ci/PO_PO/[entityId]'
import PO_ISEntityDetailPage from '@/pages/ci/PO_IS/[entityId]'
import PO_IS_POEntityDetailPage from '@/pages/ci/PO_IS_PO/[entityId]'
import PO_POInformationOutlet from '@/pages/ci/PO_PO/[entityId]/information'
import PO_PODocumentsOutlet from '@/pages/ci/PO_PO/[entityId]/documents'
import PO_PORelationshipOutlet from '@/pages/ci/PO_PO/[entityId]/relationships'
import PO_POHistoryOutlet from '@/pages/ci/PO_PO/[entityId]/history'
import PO_ISInformationOutlet from '@/pages/ci/PO_IS/[entityId]/information'
import PO_IS_POInformationOutlet from '@/pages/ci/PO_IS_PO/[entityId]/information'
import HowToMonitoringPage from '@/pages/howto/monitoringHowTo'
import HowToGenericPage from '@/pages/howto/[howToEnumType]'
import ServicesListPage from '@/pages/monitoring/services/services'
import SLAParamsListPage from '@/pages/sla-params-list/[entityName]'
import RelationListPage from '@/pages/relations'
import { SlaContractList } from '@/pages/ci/Kontrakt/list'
import { OlaContractAdd } from '@/pages/ola-contract-list/add'
import { OlaContractDetail } from '@/pages/ola-contract-list/detail'
import { OlaContractEdit } from '@/pages/ola-contract-list/edit'
import { IntegrationLinkCreate } from '@/pages/ci/Integracia/create'
import { EditIntegrationLinkPage } from '@/pages/ci/Integracia/[entityId]/edit'
import RefIdentifierDetailPage from '@/pages/data-objects/ref-identifiers/[id]/detail'
import RefIdentifierCreatePage from '@/pages/data-objects/ref-identifiers/create'
import RefIdentifierEditPage from '@/pages/data-objects/ref-identifiers/[id]/edit'
import CloneKSPage from '@/pages/ci/KS/[entityId]/clone'
import PersonalDataInfoPage from '@/pages/cookies/personalDataProtection'
import TermsOfUse from '@/pages/cookies/termsOfUse'
import CookiesSettings from '@/pages/cookies/settings'
import { ReportsDetailPage } from '@/pages/reports/[entityId]/report'
import CookiesInfoPage from '@/pages/cookies/info'
import DeclarationPage from '@/pages/technical/declaration'
import CreateTrainingEntityPage from '@/pages/ci/Trainings/create'
import EditTrainingEntityPage from '@/pages/ci/Trainings/[entityId]/edit'
import AboutApplicationPage from '@/pages/about-application/aboutApp'
import TrainingInformation from '@/pages/ci/Trainings/[entityId]/information'
import ITVSExceptionsInformation from '@/pages/ci/OsobitnyPostup/[entityId]/information'

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
                path: RouterRoutes.STANDARDIZATION_MEETINGS_DETAIL_PARTICIPATE,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_DETAIL_PARTICIPATE,
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
                path: RouterRoutes.CI_GOAL_DETAIL,
                slug: RouterRoutes.CI_GOAL_DETAIL,
                component: GoalEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_GOAL_CREATE,
                slug: RouterRoutes.CI_GOAL_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_ACTIVITY_DETAIL,
                slug: RouterRoutes.CI_ACTIVITY_DETAIL,
                component: ActivityEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_KRIS_LIST,
                slug: RouterRoutes.CI_KRIS_LIST,
                component: KRISListPage,
            },
            {
                path: RouterRoutes.CI_ACTIVITY_CREATE,
                slug: RouterRoutes.CI_ACTIVITY_CREATE,
                component: CreateEntityPage,
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
                component: CreateEntityPage,
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
                component: TrainingEntityDetailPage,
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
                path: '*',
                component: TodoPage,
            },
        ],
    },
]
