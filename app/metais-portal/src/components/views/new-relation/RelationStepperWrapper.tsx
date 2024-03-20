import React, { useEffect, useState } from 'react'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { FieldErrors } from 'react-hook-form'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'

interface RelationStepperWrapperProps {
    data: ISection[]
    errors: FieldErrors
}

export const RelationStepperWrapper: React.FC<RelationStepperWrapperProps> = ({ data, errors }) => {
    const [sections, setSections] = useState<ISection[]>(data)

    const handleSectionOpen = (id: string) => {
        setSections((prev) => prev.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)))
    }

    const openOrCloseAllSections = () => {
        setSections((prev) => {
            const allOpen = prev.every((item) => item.isOpen)
            return prev.map((item) => ({ ...item, isOpen: !allOpen }))
        })
    }

    const handleSectionBasedOnError = (err: FieldErrors) => {
        setSections((prev) =>
            prev.map((section) => {
                const isSectionError = Object.keys(err).find((item) => item.includes(section.id ?? ''))
                if (isSectionError) {
                    return { ...section, isOpen: true, error: true }
                }
                return { ...section, error: false }
            }),
        )
    }

    useEffect(() => {
        handleSectionBasedOnError(errors)
    }, [errors])

    return <Stepper subtitleTitle="" stepperList={sections} handleSectionOpen={handleSectionOpen} openOrCloseAllSections={openOrCloseAllSections} />
}
