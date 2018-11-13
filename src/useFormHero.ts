import { useState, HtmlHTMLAttributes } from "react"
import { onSubmit } from "./positionsForm"
import PositionForm from "./PositionForm"
import isEmpty from "lodash/isEmpty"

interface FormHeroProps<T, X> {
  initialValues: T
  validations: Array<((p: T) => X)>
  onSubmit: (p: T) => void
}

interface FormHero<T, X> {
  errors: X
  values: T
  setValues: ((p: T) => void)
  updateFromEvent: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

/*
 * Similar to Formik, but with hooks api!
 * Provides the most basic boilerplate blocks for building forms
 * with a decoupled UI
 */

const useFormHero = ({
  initialValues,
  validations = [],
  onSubmit
}: FormHeroProps<any, any>): FormHero<any, any> => {
  const [values, setValues] = useState(initialValues)

  // convenience function for easiest way to update value from named input fields
  const updateFromEvent = ({
    target: { value, name }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [name]: value })

  const errors: any = validations.reduce((acc, validation) => {
    return { ...acc, ...validation(values) }
  }, {})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isEmpty(errors)) {
      onSubmit(values)
    }
  }

  return {
    values,
    errors,
    setValues,
    updateFromEvent,
    handleSubmit
  }
}

export default useFormHero
