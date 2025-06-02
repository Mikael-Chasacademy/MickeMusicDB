import { Add } from "iconsax-react";

export default function AddBtn({ onClick, className = "", floating = false }) {
  const baseClasses = "p-2 bg-white rounded-full shadow-md hover:bg-green-50 cursor-pointer transition-colors w-9 h-9";
  const floatingClasses = "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity";
  const staticClasses = "text-gray-600 hover:text-gray-800";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${floating ? floatingClasses : staticClasses} ${className}`}
    >
      <Add color="green" size={20} />
    </button>
  );
}
