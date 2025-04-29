import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";
import { getForm } from '@/services/api';
import { FormResponse, FormField } from '@/types/form';

interface DynamicFormProps {
  rollNumber: string;
}

export default function DynamicForm({ rollNumber }: DynamicFormProps) {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, trigger, setFocus } = useForm({ mode: 'onChange' });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await getForm(rollNumber);
        setFormData(data);
      } catch (err) {
        setError('Failed to load form. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [rollNumber]);

  const handleNext = async () => {
    const fieldIds = formData?.form.sections[currentSection].fields.map((field: FormField) => field.fieldId) || [];
    const isSectionValid = await trigger(fieldIds);
    if (isSectionValid) {
      setCurrentSection((prev) => prev + 1);
    } else {
      // Optionally focus the first error field
      const firstErrorField = fieldIds.find((id) => errors[id]);
      if (firstErrorField) setFocus(firstErrorField);
    }
  };

  const handlePrev = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const onSubmit = (data: Record<string, any>) => {
    console.log('Form Submission Data:', data);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <p className="text-blue-700 text-lg font-bold">Loading form...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <p className="text-red-500 text-center text-lg font-bold">{error}</p>
    </div>
  );
  if (!formData) return null;

  const { sections, formTitle } = formData.form;
  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">{formTitle}</h2>
        <h3 className="text-xl font-bold text-purple-700 mb-2">{currentSectionData.title}</h3>
        <p className="text-gray-700 mb-4">{currentSectionData.description}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentSectionData.fields.map((field: FormField) => (
            <div key={field.fieldId} className="mb-5">
              <label className="block text-gray-800 font-semibold mb-1">
                {field.label}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.fieldId, {
                    required: field.required ? field.validation?.message || `${field.label} is required` : false,
                    minLength: field.minLength ? { value: field.minLength, message: field.validation?.message || `Minimum length is ${field.minLength}` } : undefined,
                    maxLength: field.maxLength ? { value: field.maxLength, message: field.validation?.message || `Maximum length is ${field.maxLength}` } : undefined,
                  })}
                  placeholder={field.placeholder}
                  className={`w-full p-3 border rounded-lg shadow focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50 placeholder-gray-400 ${
                    errors[field.fieldId] ? 'border-red-400' : 'border-blue-200'
                  }`}
                  data-testid={field.dataTestId}
                />
              ) : field.type === 'dropdown' ? (
                <select
                  {...register(field.fieldId, {
                    required: field.required ? field.validation?.message || `${field.label} is required` : false,
                  })}
                  className={`w-full p-3 border rounded-lg shadow focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50 ${
                    errors[field.fieldId] ? 'border-red-400' : 'border-blue-200'
                  }`}
                  data-testid={field.dataTestId}
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value} data-testid={option.dataTestId}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'radio' ? (
                <div className="flex flex-col gap-1">
                  {field.options?.map((option) => (
                    <label key={option.value} className="inline-flex items-center gap-2 text-gray-700 font-medium">
                      <input
                        type="radio"
                        {...register(field.fieldId, {
                          required: field.required ? field.validation?.message || `${field.label} is required` : false,
                        })}
                        value={option.value}
                        className="accent-blue-500"
                        data-testid={option.dataTestId}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  {...register(field.fieldId, {
                    required: field.required ? field.validation?.message || `${field.label} is required` : false,
                  })}
                  className={`accent-blue-500 mr-2 ${errors[field.fieldId] ? 'border-red-400' : ''}`}
                  data-testid={field.dataTestId}
                />
              ) : (
                <input
                  type={field.type}
                  {...register(field.fieldId, {
                    required: field.required ? field.validation?.message || `${field.label} is required` : false,
                    minLength: field.minLength ? { value: field.minLength, message: field.validation?.message || `Minimum length is ${field.minLength}` } : undefined,
                    maxLength: field.maxLength ? { value: field.maxLength, message: field.validation?.message || `Maximum length is ${field.maxLength}` } : undefined,
                  })}
                  placeholder={field.placeholder}
                  className={`w-full p-3 border rounded-lg shadow focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50 placeholder-gray-400 ${
                    errors[field.fieldId] ? 'border-red-400' : 'border-blue-200'
                  }`}
                  data-testid={field.dataTestId}
                />
              )}
              <ErrorMessage
                errors={errors}
                name={field.fieldId}
                render={({ message }) => (
                  <p className="text-red-500 text-sm mt-1 font-medium">{message}</p>
                )}
              />
            </div>
          ))}
          <div className="flex justify-between mt-8">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="py-2 px-6 bg-gray-200 text-gray-700 font-bold rounded-lg shadow hover:bg-gray-300 transition"
              >
                Previous
              </button>
            )}
            {isLastSection ? (
              <button
                type="submit"
                className="py-2 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
