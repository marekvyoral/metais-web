import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { RadioButton } from '../components/RadioButton'

interface IFormInput {
    name: string
    name1: string
}

import { AccordionContainer } from '../components/Accordion'

export const DevTestScreen: React.FC = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            name1: '',
        },
    })

    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)
    return (
        <>
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

            <AccordionContainer
                sections={[
                    { title: 'Title1', summary: 'Summary1', content: 'content-1' },

                    { title: 'Title2', summary: 'Summary2', content: 'content-2' },

                    { title: 'Title3', summary: 'Summary1', content: 'content-3' },
                    {
                        title: 'Title4',
                        summary: (
                            <>
                                Summary <b>4</b> (JSX)
                            </>
                        ),
                        content: 'content-4',
                    },
                ]}
            />
        </>
    )
}
