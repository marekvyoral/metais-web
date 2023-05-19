import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { RadioButton } from '../components/RadioButton'

interface IFormInput {
    name: string
    name1: string
}

export const DevTestScreen: React.FC = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            name1: '',
        },
    })

    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)
    return (
        <div>
            <h4>Obrazovka na testovanie komponentov</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="govuk-fieldset">
                    <RadioButton {...register('name')} id="id" name="name" value="Hraško" label="ano" />
                    <RadioButton {...register('name1')} id="id1" name="name" value="Hraško1" label="ano1" />
                </fieldset>
                <div>
                    <button className="govuk-button">Odoslať formulár</button>
                </div>
            </form>
        </div>
    )
}
