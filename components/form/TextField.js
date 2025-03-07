import cn from "@/utilities/cn";

export default function TextField({ className = "", ...props }) {
  return (
    <input type="text" className={cn("field-base", className)} {...props} />
  );
}
