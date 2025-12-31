/**
 * Custom Hook: useForm
 * Handles form state, validation, and submission
 */

import { useState, useCallback } from "react";

export const useForm = (initialValues = {}, validationRules = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return null;

      // Required validation
      if (rules.required && !value) {
        return rules.requiredMessage || `${name} is required`;
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        return (
          rules.minLengthMessage ||
          `${name} must be at least ${rules.minLength} characters`
        );
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        return (
          rules.maxLengthMessage ||
          `${name} must not exceed ${rules.maxLength} characters`
        );
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.patternMessage || `${name} is invalid`;
      }

      // Custom validation
      if (rules.validate && typeof rules.validate === "function") {
        return rules.validate(value, values);
      }

      return null;
    },
    [validationRules, values]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));

      // Validate field if it has been touched
      if (touched[name]) {
        const error = validateField(name, newValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;

      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate field on blur
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [values, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(validationRules).forEach((name) => {
        allTouched[name] = true;
      });
      setTouched(allTouched);

      // Validate form
      const isValid = validateForm();

      if (!isValid) return;

      // Submit form
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validationRules, validateForm, onSubmit]
  );

  /**
   * Reset form
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set field error programmatically
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validateForm,
  };
};

export default useForm;
