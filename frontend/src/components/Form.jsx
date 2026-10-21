import { memo } from 'react'
import { useForm } from '../hooks/useForm.js'
import FormInput from './FormInput.jsx'
import FormTextarea from './FormTextarea.jsx'
import Button from './Button.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

const Form = memo(function Form({ initialValues, validationRules, onSubmit, children, submitText = 'Submit', loading = false }) {
  const { values, errors, touched, handleChange, handleBlur, validate, reset, isValid } = useForm(initialValues, validationRules)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      await onSubmit(values, reset)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {typeof children === 'function' ? children({ values, errors, touched, handleChange, handleBlur, FormInput, FormTextarea }) : children}
      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={!isValid || loading}>
          {loading ? <><LoadingSpinner size="sm" className="mr-2" /> Submitting...</> : submitText}
        </Button>
        <Button type="button" variant="secondary" onClick={reset} disabled={loading}>
          Reset
        </Button>
      </div>
    </form>
  )
})

export default Form
