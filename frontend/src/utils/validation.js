export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^\+?[\d\s-()]{7,15}$/,
    message: 'Please enter a valid phone number',
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL',
  },
  required: {
    message: 'This field is required',
  },
  minLength: (min) => ({
    validate: (value) => value.length >= min,
    message: `Minimum ${min} characters required`,
  }),
  maxLength: (max) => ({
    validate: (value) => value.length <= max,
    message: `Maximum ${max} characters allowed`,
  }),
}

export function validateField(value, rules) {
  if (!rules) return null

  if (rules.required && (!value || value.trim() === '')) {
    return rules.requiredMessage || validationRules.required.message
  }

  if (rules.pattern && value && !rules.pattern.test(value)) {
    return rules.patternMessage || rules.message
  }

  if (rules.minLength && value && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`
  }

  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`
  }

  if (rules.custom && !rules.custom(value)) {
    return rules.customMessage || 'Invalid value'
  }

  return null
}

export function validateForm(values, schema) {
  const errors = {}
  Object.keys(schema).forEach((field) => {
    const error = validateField(values[field], schema[field])
    if (error) {
      errors[field] = error
    }
  })
  return errors
}
