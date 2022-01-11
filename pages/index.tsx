import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { RiTimerFlashLine, RiBellFill, RiTimer2Fill } from "react-icons/ri";
import { Header } from "../components/header";
import { InputControl } from "../components/input-control";
import { Bell } from "../models/bell.interface";

const Home: NextPage = () => {
  const [ltTime, setLtTime] = useState<number | undefined>();
  const [bellTimes, setBellTimes] = useState<(number | undefined)[]>([]);

  // LT時間変更
  const changeLtTime = useCallback((value: string) => {
    setLtTime(value ? +value : undefined);
  }, []);

  // ベルのタイミング変更
  const changeBellTime = useCallback(
    (index: number, timeValue: string) => {
      const tmpBellTimes = [...bellTimes];
      tmpBellTimes.splice(index, 1, timeValue ? +timeValue : undefined);
      setBellTimes(tmpBellTimes);
    },
    [bellTimes]
  );

  // ベル削除
  const deleteBellTime = useCallback(
    (index: number) => {
      const tmpBellTimes = [...bellTimes];
      tmpBellTimes.splice(index, 1);
      setBellTimes(tmpBellTimes);
    },
    [bellTimes]
  );

  const router = useRouter();
  const handleStartLt = () => {
    router.push({
      pathname: "/time-progress",
      query: {
        lttime: ltTime,
        belltimes: bellTimes.map((x) => x + "").join(","),
      },
    });
  };

  return (
    <div className="container mx-auto px-4 h-screen max-w-md">
      <Header />
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time"
          >
            開催時間
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="time"
            type="number"
            placeholder="10"
            min={0}
            value={ltTime || ""}
            onChange={(e) => changeLtTime(e.target.value)}
          />
        </div>
        {bellTimes.map((bellTime, index) => (
          <InputControl
            key={"bell" + (index + 1)}
            id={"bell" + (index + 1)}
            label={"ベル" + (index + 1) + "回目"}
            time={bellTime}
            onChangeBell={(time) => changeBellTime(index, time)}
            onDeleteBell={() => deleteBellTime(index)}
          />
        ))}
        <div className="mt-2">
          <button
            className="
              w-full inline-flex items-center justify-center h-10 px-5 text-yellow-500 
              border border-yellow-500 duration-150 bg-transparent rounded-lg focus:shadow-outline"
            onClick={() => setBellTimes(bellTimes.concat([0]))}
          >
            <RiBellFill />
            <span>ベル追加</span>
          </button>
        </div>
        <div className="mt-2">
          <button
            className="w-full inline-flex items-center justify-center h-10 px-5 
                text-white bg-yellow-500 duration-150 bg-transparent rounded-lg focus:shadow-outline"
            onClick={handleStartLt}
          >
            <RiTimer2Fill />
            <span>LT 開始</span>
          </button>
        </div>
      </div>
      <footer></footer>
    </div>
  );
};

export default Home;
