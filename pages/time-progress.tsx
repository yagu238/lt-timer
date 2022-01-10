import { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "../components/header";

const TimeProgress: NextPage = () => {
  const router = useRouter();
  const { lttime, belltimes } = router.query;

  return (
    <div className="container mx-auto px-4 h-screen">
      <Header />
      <p>LT Time: {lttime}</p>
      <p>Bells: {belltimes}</p>
    </div>
  );
};

export default TimeProgress;
