import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

export interface CodeListWorkingLanguageData {
    workingLanguage: string
    setWorkingLanguage: Dispatch<SetStateAction<string>>
}

const noopSetState = () => {
    // intentionally empty
}

const CodeListWorkingLanguageContext = createContext<CodeListWorkingLanguageData>({
    workingLanguage: 'sk',
    setWorkingLanguage: () => noopSetState(),
})

const useCodeListWorkingLanguage = () => useContext(CodeListWorkingLanguageContext)

const CodeListWorkingLanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [workingLanguage, setWorkingLanguage] = useState<string>('sk')

    return (
        <CodeListWorkingLanguageContext.Provider
            value={{
                workingLanguage,
                setWorkingLanguage,
            }}
        >
            {children}
        </CodeListWorkingLanguageContext.Provider>
    )
}

export { useCodeListWorkingLanguage, CodeListWorkingLanguageProvider }
