import { NextPage } from "next";
import useSound from "use-sound";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "../components/header";
import { noticeService } from "../services/notice";

const TimeProgress: NextPage = () => {
  const router = useRouter();
  const { lttime, belltimes } = router.query;
  const [timer, setTimer] = useState<Timer>({
    minutes: lttime ? +lttime : 0,
    seconds: 0,
  });

  const [playEnd] = useSound<string>("/end.mp3");
  const [playBell] = useSound<string>("/bell.mp3");

  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>(
    setInterval(() => {}, 1000)
  );
  const [isProgress, setIsProgress] = useState<boolean>(true);

  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0) return;
    const interval = setInterval(() => {
      const t = countdownTimer(timer);
      const strBellTimes = belltimes ? getAsString(belltimes) : "";
      const arrBellTimes = strBellTimes.split(",").map((x) => +x);
      if (t.minutes < 0 || t.seconds < 0) {
        console.log("finite");
        clearInterval(interval);
        playEnd();
        noticeService.noticeToSlack("終了です！お疲れ様でした！");
      } else if (arrBellTimes.includes(t.minutes) && t.seconds === 0) {
        console.log("playBell");
        playBell();
        setTimer(t);
      } else {
        setTimer(t);
      }
    }, 1000);

    setTimerInterval(interval);
    return () => clearInterval(interval);
  }, [belltimes, playBell, playEnd, timer]);

  const hundlePause = useCallback(
    (isProgress: boolean) => {
      if (isProgress) {
        clearInterval(timerInterval);
        setIsProgress(false);
      } else {
        setTimeout(() => {
          setTimer(countdownTimer(timer));
          setIsProgress(true);
        }, 300);
      }
    },
    [timer, timerInterval]
  );

  return (
    <div className="container mx-auto px-4 h-screen">
      <Header />
      <div>
        <h1 className="text-9xl flex justify-center items-center p-4">
          {timer.minutes}:{timer.seconds}
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

interface Timer {
  minutes: number;
  seconds: number;
}

const countdownTimer = (timer: Timer) => {
  let sec = timer.minutes * 60 + timer.seconds - 1;
  const nextTimer: Timer = {
    minutes: Math.floor(sec / 60),
    seconds: sec % 60,
  };
  return nextTimer;
};

const getAsString = (value: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export default TimeProgress;
