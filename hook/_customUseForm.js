// hook/_customUseForm.js
import { useState, useEffect, useRef } from "react";
import {
  useForm as useHookForm,
  Controller,
  useFieldArray,
} from "react-hook-form";

export function useForm(defaultValues) {
  // Use a ref to track if we've initialized with autofill values
  const autofillSyncedRef = useRef(false);
  
  // Get autofilled values immediately if we're on the client
  let initialValues = { ...defaultValues };
  if (typeof window !== 'undefined' && !autofillSyncedRef.current) {
    // Only try to get autofilled values on initial render
    setTimeout(() => {
      Object.keys(defaultValues).forEach(key => {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input && input.value) {
          initialValues[key] = input.value;
        }
      });
    }, 0);
  }

  const {
    register: originalRegister,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useHookForm({ 
    defaultValues: initialValues,
    mode: "onChange" // Validate on change for better user experience
  });

  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState(initialValues);
  const [apiErrors, setApiErrors] = useState({});

  // Sync with autofill on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !autofillSyncedRef.current) {
      // This runs after the component mounts
      autofillSyncedRef.current = true;
      
      // Use MutationObserver to detect autofill changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              mutation.attributeName === 'value' && 
              mutation.target.tagName === 'INPUT') {
            const input = mutation.target;
            const name = input.getAttribute('name');
            if (name && Object.keys(defaultValues).includes(name)) {
              setValue(name, input.value);
              setData(prev => ({ ...prev, [name]: input.value }));
            }
          }
        });
      });
      
      // Observe all input fields
      Object.keys(defaultValues).forEach(key => {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input) {
          // Set immediate values if they exist
          if (input.value) {
            setValue(key, input.value);
            setData(prev => ({ ...prev, [key]: input.value }));
          }
          
          // Observe future changes
          observer.observe(input, { 
            attributes: true, 
            attributeFilter: ['value'] 
          });
        }
      });
      
      // Also handle animationstart events for Chrome's autofill
      const handleAnimationStart = (e) => {
        if (e.animationName.includes('autofill')) {
          const input = e.target;
          const name = input.getAttribute('name');
          if (name && Object.keys(defaultValues).includes(name)) {
            // Small timeout to ensure the value is set by the browser
            setTimeout(() => {
              setValue(name, input.value);
              setData(prev => ({ ...prev, [name]: input.value }));
            }, 10);
          }
        }
      };
      
      document.addEventListener('animationstart', handleAnimationStart);
      
      return () => {
        observer.disconnect();
        document.removeEventListener('animationstart', handleAnimationStart);
      };
    }
  }, []);

  // Custom register function that captures autofill
  const register = (name, validationRules = {}) => {
    // Extract custom validation rules if present
    const { isEmail, ...standardRules } = validationRules;

    // Add custom email validation if isEmail is specified
    if (isEmail) {
      standardRules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: typeof isEmail === 'string' ? isEmail : 'Please enter a valid email address'
      };
    }

    // Get the original register props
    const registerProps = originalRegister(name, standardRules);

    // Add onInput handler to detect changes, including autofill
    const enhancedOnChange = (e) => {
      registerProps.onChange(e); // Original onChange
      setData(prev => ({ ...prev, [name]: e.target.value }));
    };

    return {
      ...registerProps,
      onChange: enhancedOnChange,
      onInput: enhancedOnChange // Helps with some browsers
    };
  };

  const submit = async (callback) => {
    setProcessing(true);
    try {
      await callback(data);
    } finally {
      setProcessing(false);
    }
  };

  const setFormData = (key, value) => {
    if (typeof key !== "string") {
      console.error("setFormData error: key must be a string", key);
      return;
    }

    setData((prev) => ({ ...prev, [key]: value }));
    setValue(key, value);
  };

  const request = async (method, url, options = {}) => {
    setProcessing(true);
    setApiErrors({}); // Clear previous errors
    try {
      const isFormData = options.body instanceof FormData;
      const fetchOptions = {
        method,
        ...options,
      };

      if (!isFormData && method !== "GET") {
        fetchOptions.headers = {
          "Content-Type": "application/json",
          ...options.headers,
        };
        if (options.body) {
          fetchOptions.body = JSON.stringify(options.body);
        }
      }

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + url,
        fetchOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setApiErrors(errorData.errors); // Store validation errors
        }
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Request Error:", error.message);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const post = (url, options) => request("POST", url, options);
  const put = (url, options) => request("PUT", url, options);
  const get = (url, options) => request("GET", url, options);

  return {
    useFieldArray,
    Controller,
    control,
    data,
    setData: setFormData,
    processing,
    register,
    handleSubmit,
    submit,
    reset,
    watch,
    errors,
    apiErrors,
    isSubmitting,
    post,
    put,
    get,
  };
}

export default useForm;