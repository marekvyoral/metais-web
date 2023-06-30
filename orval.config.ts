import path from 'path'

import dotenv from 'dotenv'
import { defineConfig } from 'orval'

if (process.env.DOTENV_CONFIG_PATH) {
    dotenv.config({
        path: path.resolve(__dirname, process.env.DOTENV_CONFIG_PATH),
    })
}

const defaultOutputOptions: object = {
    client: 'react-query',
    prettier: true,
    mock: JSON.parse(process.env.VITE_SWAGGER_MOCK ?? 'false') ?? false,
}

export default defineConfig({
    cmdbSwagger: {
        input: {
            override: {
                transformer: './app/metais-portal/scripts/attributesTypesTransformer.js',
            },
            target: process.env.VITE_REST_CLIENT_CMDB_SWAGGER_SWAGGER_URL ?? '',
            filters: {
                tags: [
                    'cmdb-cache-controller',
                    'cmdb-change-owner-controller',
                    'cmdb-elastic-delete-controller',
                    'cmdb-elastic-read-controller',
                    'cmdb-elastic-store-controller',
                    'cmdb-history-read-controller',
                    'cmdb-invalidate-controller',
                    'cmdb-metrics-controller',
                    'cmdb-po-controller',
                    'cmdb-read-controller',
                    'cmdb-recycle-controller',
                    'cmdb-request-tracking-controller',
                    'cmdb-rights-controller',
                    'cmdb-store-controller',
                    'cmdb-user-feedback-controller',
                    'cmdb-util-controller',
                    'health-controller',
                ],
            },
        },
        output: {
            target: `./app/metais-portal/src/api/generated/cmdb-swagger.ts`,
            override: {
                operations: {
                    readCiNeighboursUsingPOST: {
                        query: {
                            useQuery: true,
                        },
                        mutator: {
                            path: './app/metais-portal/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForreadCiNeighboursUsingPOST',
                        },
                    },
                    readConfigurationItemUsingGET: {
                        mutator: {
                            path: './app/metais-portal/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadConfigurationItemUsingGET',
                        },
                    },
                    getRoleParticipantUsingGET: {
                        mutator: {
                            path: './app/metais-portal/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForGetRoleParticipantUsingGET',
                        },
                    },
                    readCiNeighboursWithAllRelsUsingGET: {
                        mutator: {
                            path: './app/metais-portal/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadCiNeighboursWithAllRelsUsingGET',
                        },
                    },
                    readCiListUsingPOST: {
                        query: {
                            useQuery: true,
                        },
                        mutator: {
                            path: './app/metais-portal/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadCiListUsingPOST',
                        },
                    },
                },
                mutator: {
                    path: './app/metais-portal/src/api/hooks/useCmdbSwaggerClient.ts',
                    name: 'useCmdbSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    typesRepo: {
        input: {
            target: process.env.VITE_REST_CLIENT_TYPES_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: [
                    'attribute-controller',
                    'attribute-profile-controller',
                    'ci-type-controller',
                    'ci-type-relationship-type-map-controller',
                    'relationship-type-controller',
                    'rights-type-controller',
                ],
            },
        },
        output: {
            target: `./app/metais-portal/src/api/generated/types-repo-swagger.ts`,
            override: {
                mutator: {
                    path: './app/metais-portal/src/api/hooks/useTypesRepoSwaggerClient.ts',
                    name: 'useTypesRepoSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    dms: {
        input: {
            target: process.env.VITE_REST_CLIENT_DMS_SWAGGER_URL ?? '',
            filters: {
                tags: ['file-controller', 'utils-controller'],
            },
        },
        output: {
            target: `./app/metais-portal/src/api/generated/dms-swagger.ts`,
            override: {
                mutator: {
                    path: './app/metais-portal/src/api/hooks/useDmsSwaggerClient.ts',
                    name: 'useDmsSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    enumsRepo: {
        input: {
            target: process.env.VITE_REST_CLIENT_ENUMS_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: ['scheduled-jobs-controller', 'enums-controller', 'enums-item-controller'],
            },
        },
        output: {
            target: `./app/metais-portal/src/api/generated/enums-repo-swagger.ts`,
            override: {
                mutator: {
                    path: './app/metais-portal/src/api/hooks/useEnumsRepoSwaggerClient.ts',
                    name: 'useEnumsRepoSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    userConfig: {
        input: {
            target: process.env.VITE_REST_CLIENT_USER_CONFIG_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: ['favorites-columns-controller'],
            },
        },
        output: {
            target: `./app/metais-portal/src/api/generated/user-config-swagger.ts`,
            override: {
                mutator: {
                    path: './app/metais-portal/src/api/hooks/useUserConfigSwaggerClient.ts',
                    name: 'useUserConfigSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    adminCmdbSwagger: {
        input: {
            override: {
                transformer: './app/metais-portal/scripts/attributesTypesTransformer.js',
            },
            target: process.env.VITE_REST_CLIENT_CMDB_SWAGGER_SWAGGER_URL ?? '',
            filters: {
                tags: [
                    'cmdb-cache-controller',
                    'cmdb-change-owner-controller',
                    'cmdb-elastic-delete-controller',
                    'cmdb-elastic-read-controller',
                    'cmdb-elastic-store-controller',
                    'cmdb-history-read-controller',
                    'cmdb-invalidate-controller',
                    'cmdb-metrics-controller',
                    'cmdb-po-controller',
                    'cmdb-read-controller',
                    'cmdb-recycle-controller',
                    'cmdb-request-tracking-controller',
                    'cmdb-rights-controller',
                    'cmdb-store-controller',
                    'cmdb-user-feedback-controller',
                    'cmdb-util-controller',
                    'health-controller',
                ],
            },
        },
        output: {
            target: `./app/metais-admin/src/api/generated/cmdb-swagger.ts`,
            override: {
                operations: {
                    readCiNeighboursUsingPOST: {
                        query: {
                            useQuery: true,
                        },
                        mutator: {
                            path: './app/metais-admin/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForreadCiNeighboursUsingPOST',
                        },
                    },
                    readConfigurationItemUsingGET: {
                        mutator: {
                            path: './app/metais-admin/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadConfigurationItemUsingGET',
                        },
                    },
                    getRoleParticipantUsingGET: {
                        mutator: {
                            path: './app/metais-admin/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForGetRoleParticipantUsingGET',
                        },
                    },
                    readCiNeighboursWithAllRelsUsingGET: {
                        mutator: {
                            path: './app/metais-admin/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadCiNeighboursWithAllRelsUsingGET',
                        },
                    },
                    readCiListUsingPOST: {
                        query: {
                            useQuery: true,
                        },
                        mutator: {
                            path: './app/metais-admin/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadCiListUsingPOST',
                        },
                    },
                },
                mutator: {
                    path: './app/metais-admin/src/api/hooks/useCmdbSwaggerClient.ts',
                    name: 'useCmdbSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    adminTypesRepo: {
        input: {
            target: process.env.VITE_REST_CLIENT_TYPES_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: [
                    'attribute-controller',
                    'attribute-profile-controller',
                    'ci-type-controller',
                    'ci-type-relationship-type-map-controller',
                    'relationship-type-controller',
                    'rights-type-controller',
                    'query',
                ],
            },
        },
        output: {
            target: `./app/metais-admin/src/api/generated/types-repo-swagger.ts`,
            override: {
                operations: {
                    listAttrProfileUsingPOST: {
                        query: {
                            useQuery: true,
                        },
                    },
                    listTypesUsingPOST: {
                        query: {
                            useQuery: true,
                        },
                    },
                },
                mutator: {
                    path: './app/metais-admin/src/api/hooks/useTypesRepoSwaggerClient.ts',
                    name: 'useTypesRepoSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
})
