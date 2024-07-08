// components/ui/checkbox.tsx
import { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, ...props }, ref) => (
    <label className="inline-flex items-center">
      <input type="checkbox" ref={ref} {...props} className="form-checkbox" />
      <span className="ml-2">{children}</span>
    </label>
  )
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
