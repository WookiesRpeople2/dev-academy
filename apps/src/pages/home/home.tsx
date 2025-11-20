import { Hero } from "@/components/Hero";
import { Programmes } from "@/components/Programmes";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Hero onGetStarted={() => navigate("/programmes")} />
      <Programmes featured={true} />
    </>
  );
};
