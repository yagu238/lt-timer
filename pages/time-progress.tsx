import { NextPage } from "next";
import useSound from "use-sound";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { Header } from "../components/header";
import { noticeService } from "../services/notice";

const TimeProgress: NextPage = () => {
  const router = useRouter();
  const { lttime, belltimes } = router.query;
  const [timer, setTimer] = useState<Timer>({
    minutes: lttime ? +lttime : 0,
    seconds: 0,
  });

  const [playEnd] = useSound("/end.mp3");

  useEffect(() => {
    const interval = setInterval(() => {
      const t = countdownTimer(timer);
      if (t.minutes < 0 || t.seconds < 0) {
        console.log("finite");
        clearInterval(interval);
        playEnd();
        noticeService.noticeToSlack("終了です！お疲れ様でした！");
      } else {
        setTimer(t);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [playEnd, timer]);

  return (
    <div className="container mx-auto px-4 h-screen">
      <Header />
      <div>
        <h1 className="text-4xl flex justify-center items-center p-4">
          {timer.minutes}:{timer.seconds}
        </h1>
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

export default TimeProgress;
