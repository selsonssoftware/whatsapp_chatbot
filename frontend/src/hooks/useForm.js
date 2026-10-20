import { useState, useCallback, useMemo } from 'react'

export function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = useCallback((fieldValues = values) => {
    const newErrors = {}
    Object.keys(validationRules).forEach((field) => {
      const value = fieldValues[field]
      const rules = validationRules[field]

      if (rules.required && (!value || value.trim() === '')) {
        newErrors[field] = rules.requiredMessage || `${field} is required`
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || `${field} is invalid`
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        newErrors[field] = `${field} must not exceed ${rules.maxLength} characters`
      }

      if (rules.custom && !rules.custom(value, fieldValues)) {
        newErrors[field] = rules.customMessage || `${field} is invalid`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationRules])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (touched[name]) {
      validate({ ...values, [name]: type === 'checkbox' ? checked : value })
    }
  }, [touched, values, validate])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validate(values)
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])
  const isDirty = useMemo(() => Object.keys(touched).length > 0, [touched])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFieldValue,
    isValid,
    isDirty,
  }
}
