import { useState } from "react";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setSuccess(false);
    setApiError("");
  };

  return { values, errors, setErrors, loading, setLoading, success, setSuccess, apiError, setApiError, handleChange, reset };
};

export default useForm;
