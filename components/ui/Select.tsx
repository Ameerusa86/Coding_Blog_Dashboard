// components/ui/select.tsx
import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";

export default Select;
