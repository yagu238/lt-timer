import { memo } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  id: string;
  label: string;
  time: number | undefined;
  onChangeBell: (timeValue: string) => void;
  onDeleteBell: () => void;
}

export const InputControl = memo((props: Props) => {
  const { id, label, time, onChangeBell, onDeleteBell } = props;

  InputControl.displayName = "app-input-control";
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="flex flex-wrap items-stretch w-full mb-4 relative">
        <input
          className="flex-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          id={id}
          type="number"
          value={time || ""}
          min={0}
          onChange={(e) => onChangeBell(e.target.value)}
        />
        <div className="flex -mr-px">
          <button
            className="flex items-center leading-normal bg-grey-lighter rounded rounded-l-none border border-l-0 border-grey-light 
                        px-3 whitespace-no-wrap text-red-500 text-lg"
            onClick={() => onDeleteBell()}
          >
            <RiDeleteBin5Line />
          </button>
        </div>
      </div>
    </div>
  );
});
