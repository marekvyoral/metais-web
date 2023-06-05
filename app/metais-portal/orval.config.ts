import { defineConfig } from 'orval'

export default defineConfig({
    cmdbSwagger: {
        input: {
            target: 'http://cmdb-metais3.apps.dev.isdd.sk/v2/api-docs',
        },
        output: {
            target: `./src/generated/cmdb-swagger.ts`,
            client: 'react-query',
            prettier: true,
            override: {
                mutator: {
                    path: './src/hooks/use-custom-client.ts',
                    name: 'useCustomClient',
                },
            },
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    typesRepo: {
        input: {
            target: 'http://types-repo-metais3.apps.dev.isdd.sk/v2/api-docs',
        },
        output: {
            target: `./src/generated/types-repo-swagger.ts`,
            client: 'react-query',
            prettier: true,
            override: {
                mutator: {
                    path: './src/hooks/use-custom-client.ts',
                    name: 'useCustomClient',
                },
            },
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
})
