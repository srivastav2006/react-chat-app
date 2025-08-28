export const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  icon,
  error,
  ...props 
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="text-slate-400">
            {icon}
          </div>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-navy-500'} rounded-lg bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
