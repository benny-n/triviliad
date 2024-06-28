import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { Stat, StatsData } from "./types";
import { Box, Typography, styled } from "@mui/material";

interface StatsProps {
  data: StatsData;
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

function getTotalAnswersAndCorrectAnswers(stats: Stat[]): {
  totalQuestions: number;
  totalCorrectAnswers: number;
} {
  return stats.reduce(
    (acc, curr) => {
      acc.totalQuestions += curr.total;
      acc.totalCorrectAnswers += curr.correctAnswers;
      return acc;
    },
    { totalQuestions: 0, totalCorrectAnswers: 0 }
  );
}

const Stats: React.FC<StatsProps> = (props: StatsProps) => {
  const { data } = props;
  const width = 400;
  const height = 400;
  const { totalQuestions, totalCorrectAnswers } =
    getTotalAnswersAndCorrectAnswers(data.stats);
  return (
    <>
      <Typography marginTop={2} variant="h3">
        🎉🎉🎉🎉🎉
      </Typography>
      <Typography marginTop={1} variant="h5" align="center">
        מזל טוב, סיימת את הטריויה! <br /> בוא קח קצת סטטיסטיקות כי אנחנו יודעים
        כמה אתה אוהב:
      </Typography>
      <Typography
        variant="h3"
        fontWeight={"bold"}
        sx={{
          mt: 2,
        }}
      >
        סך הכל ענית נכון על {totalCorrectAnswers} שאלות מתוך {totalQuestions}{" "}
        שאלות
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "16px",
          mr: 10,
        }}
      >
        {data.stats.map((d, index) => (
          <PieChart
            key={index}
            colors={["red", "green"]}
            width={width}
            height={height}
            series={[
              {
                data: [
                  {
                    value: d.correctAnswers,
                    color: "green",
                  },
                  {
                    value: d.total - d.correctAnswers,
                    color: "red",
                  },
                ],
                innerRadius: 75,
              },
            ]}
          >
            <PieCenterLabel>
              {`${d.submitter}: ${d.correctAnswers}/${d.total}`}
            </PieCenterLabel>
          </PieChart>
        ))}
      </Box>
    </>
  );
};

export default Stats;
