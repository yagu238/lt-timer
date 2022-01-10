import { memo } from "react";
import { RiTimerFlashLine } from "react-icons/ri";

export const Header = memo(() => {
  Header.displayName = "app-header";
  return (
    <h1 className="text-4xl flex justify-center items-center p-4">
      <RiTimerFlashLine />
      LT TimeR
    </h1>
  );
});
