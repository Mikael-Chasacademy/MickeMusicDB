import { Trash } from "iconsax-react";

export default function DeleteBtn({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 cursor-pointer w-9 h-9 ${className}`}
    >
      <Trash color="red" size={20} />
    </button>
  );
}
