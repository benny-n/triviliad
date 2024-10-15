import { useState } from "react";
import LandingPage from "./LandingPage";
import Stats from "./Stats";
import Trivia from "./Trivia";
import {
  Routes,
  Route,
} from "react-router-dom";
import { StatsData } from "./types";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

export default function TriviaRoutes() {
  const [statsData, setStatsData] = useState<StatsData>({ stats: [] });
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/liad" element={
        <Trivia
          statsData={statsData}
          setStatsData={setStatsData}
          person="liad"
        />
      }/>
      <Route path="/oren" element={
        <ThemeProvider theme={theme("oren")}>
          <Trivia
            statsData={statsData}
            setStatsData={setStatsData}
            person="oren"
          />
        </ThemeProvider>
      }/>
      <Route path="/stats" element={<Stats data={statsData} /> } />
    </Routes>
  );
};

