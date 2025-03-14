export const FormField = ({ 
  label, 
  error, 
  children, 
  required = false, 
  helpText 
}: { 
  label: string, 
  error?: string, 
  children: React.ReactNode, 
  required?: boolean,
  helpText?: string 
}) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {helpText && <p className="text-sm text-gray-500 mb-1">{helpText}</p>}
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
  