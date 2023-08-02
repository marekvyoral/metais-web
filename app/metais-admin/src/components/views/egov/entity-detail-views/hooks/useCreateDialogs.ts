import { Dispatch, SetStateAction, useState } from 'react'
import { MutationFeedbackError } from '@isdd/metais-common'

interface iUseCreateDialogs {
    profileAttributesDialog: {
        open: boolean
        setOpen: Dispatch<SetStateAction<boolean>>
    }
    connectionsDialog: {
        connectionsOpen: boolean
        setConnectionsOpen: Dispatch<SetStateAction<boolean>>
    }
    mutationSuccessResponse: {
        successedMutation: boolean
        setSuccessedMutation: Dispatch<SetStateAction<boolean>>
    }
    mutationErrorResponse: {
        error: MutationFeedbackError | undefined
        setError: Dispatch<SetStateAction<MutationFeedbackError | undefined>>
    }
}

export const useCreateDialogs = (): iUseCreateDialogs => {
    const [open, setOpen] = useState<boolean>(false)
    const [connectionsOpen, setConnectionsOpen] = useState<boolean>(false)
    const [successedMutation, setSuccessedMutation] = useState<boolean>(false)
    const [error, setError] = useState<MutationFeedbackError | undefined>(undefined)

    return {
        profileAttributesDialog: { open, setOpen },
        connectionsDialog: { connectionsOpen, setConnectionsOpen },
        mutationSuccessResponse: { successedMutation, setSuccessedMutation },
        mutationErrorResponse: { error, setError },
    }
}
