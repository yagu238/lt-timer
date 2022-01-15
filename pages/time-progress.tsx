import { NextPage } from "next";
import useSound from "use-sound";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "../components/header";
import { noticeService } from "../services/notice";

const TimeProgress: NextPage = () => {
  const router = useRouter();
  const { ltSeconds, belltimes } = router.query;
  const strBellTimes = belltimes ? getAsString(belltimes) : "";
  const arrBellTimes = strBellTimes
    .split(",")
    .filter((x) => x !== "")
    .map((x) => +x);

  const [timerSeconds, setTimerSeconds] = useState<number>(
    ltSeconds ? +ltSeconds : 0
  );
  const [playEnd] = useSound<string>("/end.mp3");
  const [playBell] = useSound<string>("/bell.mp3");
  const [isProgress, setIsProgress] = useState<boolean>(true);

  useEffect(() => {
    if (!isProgress) return;
    if (timerSeconds < 0) {
      console.log("finite");
      playEnd();
      noticeService.noticeToSlack("終了です！お疲れ様でした！");
      router.back();
    } else if (
      arrBellTimes.includes(Math.floor(timerSeconds / 60)) &&
      timerSeconds % 60 === 0
    ) {
      console.log("playBell");
      playBell();
      setTimeout(() => setTimerSeconds(() => timerSeconds - 1), 1000);
    } else {
      setTimeout(() => setTimerSeconds(() => timerSeconds - 1), 1000);
    }
  }, [
    arrBellTimes,
    belltimes,
    isProgress,
    playBell,
    playEnd,
    router,
    timerSeconds,
  ]);

  const hundlePause = useCallback(
    (isProgress: boolean) => {
      if (isProgress) {
        setIsProgress(false);
      } else {
        setTimeout(() => {
          setIsProgress(true);
          setTimerSeconds(() => timerSeconds - 1);
        }, 300);
      }
    },
    [timerSeconds]
  );

  return (
    <div className="container mx-auto px-4 h-screen">
      <Header />
      <div>
        <h1 className="text-9xl flex justify-center items-center p-4">
          {Math.floor(timerSeconds / 60)}:{timerSeconds % 60}
        </h1>
        <div className="flex mt-32 max-w-sm mx-auto px-4">
          <button
            className="rounded-full bg-white hover:bg-gray-100 text-gray-600 font-semibold border border-gray-400 shadow py-6 px-1"
            onClick={() => router.back()}
          >
            キャンセル
          </button>
          <div className="flex-1"></div>
          <button
            className={
              isProgress
                ? "rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold border border-gray-400 shadow py-6 px-1"
                : "rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold border border-gray-400 shadow py-6 px-1"
            }
            onClick={() => hundlePause(isProgress)}
          >
            {isProgress ? "一時停止" : "　再開　"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getAsString = (value: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export default TimeProgress;
