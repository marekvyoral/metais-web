import { defineConfig } from 'orval'
const paths = [] // './swagger.json', './swagger1.json' add swagger paths

const createMultipleConfigs = () => {
    return paths?.map((path, index) => {
        return {
            input: {
                target: path,
            },
            output: {
                target: `./src/generated/part${index}.ts`,
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
        }
    })
}

const computedConfig = createMultipleConfigs()

export default defineConfig(computedConfig)
