import AlarmIcon from "@mui/icons-material/Alarm";
import {
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { StatsData } from "./types";
import { useNavigate } from "react-router-dom";

interface TriviaQuestion {
  question: string;
  answers: string[];
  who: string;
  photo?: string;
  hasPhotoAnswer?: boolean;
  correct: number;
}

const indexToLetter = (index: number): string => {
  switch (index) {
    case 0:
      return "א.";
    case 1:
      return "ב.";
    case 2:
      return "ג.";
    case 3:
      return "ד.";
    default:
      throw new Error("Invalid index: " + index);
  }
};

const ENABLE_ADMIN = false;

export interface TriviaProps {
  statsData: StatsData;
  setStatsData: (statsData: StatsData) => void;
  person: String;
}

export default function Trivia(props: TriviaProps) {
  let navigate = useNavigate();
  const statsData = props.statsData;
  const setStatsData = props.setStatsData;
  const person = props.person;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const timerSize: number = isSmall ? 90 : 180;
  const query = useQuery({
    queryKey: ["trivia"],
    queryFn: async () => {
      const response = await fetch(
        `${person}_res/trivia.json`
      );
      return response.json();
    },
  });
  const [questions, setQuestions] = useState<Array<TriviaQuestion>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestion, setAnsweredQuestion] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [opacity, setOpacity] = useState<number>(-1);
  const [timerOpacity, setTimerOpacity] = useState<number>(1);
  const [timer, setTimer] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [playTicking, setPlayTicking] = useState(false);
  const [playYouLose, setPlayYouLose] = useState(false);
  const [playYouWin, setPlayYouWin] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState(false);

  const [adminIndex, setAdminIndex] = useState(0);

  const updateStats = (submitter: string, correct: boolean) => {
    let newStatsData = { ...statsData };
    // find submitter, or create new entry
    let submitterIndex = newStatsData.stats.findIndex(
      (stat) => stat.submitter === submitter
    );
    if (submitterIndex === -1) {
      newStatsData.stats.push({ submitter, total: 0, correctAnswers: 0 });
      submitterIndex = newStatsData.stats.length - 1;
    }
    // update answers
    newStatsData.stats[submitterIndex].total++;
    if (correct) {
      newStatsData.stats[submitterIndex].correctAnswers++;
    }
    setStatsData(newStatsData);
  };

  useEffect(() => {
    if (query.isSuccess && questions.length === 0) {
      if (ENABLE_ADMIN) {
        setQuestions(query.data.questions);
      } else {
        // let indexOfFirstSunnyQuestion = query.data.questions.findIndex(
        //   (question: TriviaQuestion) => question.who === "סאני"
        // );
        // setQuestions(
        //   // shuffle all the list of questions from 2 to Sunny, but make sure that 8 and 9 remain adjacent
        //   query.data.questions
        //     .slice(0, 2)
        //     .concat(
        //       query.data.questions.slice(2, 8).sort(() => Math.random() - 0.5)
        //     )
        //     .concat(query.data.questions.slice(8, 10))
        //     .concat(
        //       query.data.questions
        //         .slice(10, indexOfFirstSunnyQuestion)
        //         .sort(() => Math.random() - 0.5)
        //     )
        //     .concat(query.data.questions.slice(indexOfFirstSunnyQuestion))
        // );
        
        // JUST SHUFFLE LIKE A NORMAL PERSON
        setQuestions(query.data.questions.sort(() => Math.random() - 0.5));
      }
      if (currentQuestionIndex < 0) {
        setCurrentQuestionIndex(0);
      }
    }
  }, [query]);

  useEffect(() => {
    if (answeredQuestion) {
      setTimeout(() => {
        setOpacity(1);
      }, 100);
    } else {
      setOpacity(0);
    }
  }, [answeredQuestion]);

  const muteAllAudio = () => {
    // setPlayAlarm(false);
    setPlayTicking(false);
    setPlayYouLose(false);
    setPlayYouWin(false);
  };

  const toggleAudio = () => {
    if (isTimerRunning) {
      muteAllAudio();
    } else {
      setPlayTicking(true);
    }
  };

  return (
    <Container maxWidth="sm">
      {playTicking && (
        <audio autoPlay>
          <source src={`${person}_res/${Math.floor(Math.random() * 8)}.mpeg`} type="audio/mpeg" />
        </audio>
      )}
      {playYouWin && (
        <audio autoPlay>
          <source src={`${person}_res/you_win.wav`} type="audio/mpeg" />
        </audio>
      )}
      {playYouLose && (
        <audio autoPlay>
          <source src={`${person}_res/you_lose.wav`} type="audio/mpeg" />
        </audio>
      )}
      {ENABLE_ADMIN && (
        <Box
          sx={{
            variant: "contained",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999,
            opacity: 0.5,
          }}
        >
          <TextField
            label="שאלה"
            value={adminIndex}
            onChange={(e: any) => {
              setAdminIndex(e.target.value);
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              setCurrentQuestionIndex(adminIndex);
              setAnsweredQuestion(false);
              setDisplayQuestions(false);
              setTimer(false);
              setTimerOpacity(1);
              muteAllAudio();
            }}
          ></Button>
        </Box>
      )}
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {questions.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {questions[currentQuestionIndex].photo && (
              <Paper variant="outlined">
                <img
                  src={`${person}_res/${questions[currentQuestionIndex].photo}`}
                  alt="question"
                  style={{ width: "100%", maxHeight: "250px" }}
                />
              </Paper>
            )}
            <Typography variant="h5" component="h2" sx={{ my: 2 }}>
              {questions[currentQuestionIndex].question}
            </Typography>
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gridTemplateRows: "repeat(2, 1fr)",
                  gap: "16px",
                  width: "100%",
                }}
              >
                {displayQuestions &&
                  questions[currentQuestionIndex].answers.map(
                    (answer, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        sx={{
                          mb: 1,
                          "&:disabled": {
                            backgroundColor: "#b34040",
                          },
                        }}
                        disabled={answeredQuestion}
                        onClick={() => {
                          setAnsweredQuestion(true);
                          if (questions[currentQuestionIndex].hasPhotoAnswer) {
                            let newQuestions = [...questions];
                            newQuestions[currentQuestionIndex].photo =
                              newQuestions[currentQuestionIndex].photo?.replace(
                                ".jpg",
                                "_answer.jpg"
                              );
                            setQuestions(newQuestions);
                          }
                          setAnswer(answer);
                          setTimerOpacity(0);
                          muteAllAudio();
                          if (
                            index === questions[currentQuestionIndex].correct
                          ) {
                            setPlayYouWin(true);
                          } else {
                            setPlayYouLose(true);
                          }
                          updateStats(
                            questions[currentQuestionIndex].who,
                            index === questions[currentQuestionIndex].correct
                          );
                          setTimeout(() => {
                            setTimer(false);
                          }, 350);
                        }}
                      >
                        <Typography
                          fontWeight={"bold"}
                          sx={{
                            position: "absolute",
                            right: "3px", // Adjust this value based on your padding
                            top: "8px",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {indexToLetter(index)}
                        </Typography>
                        {answer}
                      </Button>
                    )
                  )}
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 25,
                  left: 25,
                  fontSize: "24px",
                  fontFamily: "Montserrat",
                }}
              >
                {!timer ? (
                  <IconButton
                    color="primary"
                    sx={{
                      opacity: timerOpacity,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                    onClick={() => {
                      setTimerOpacity(0);
                      setTimeout(() => {
                        setTimer(true);
                        setPlayTicking(true);
                        setIsTimerRunning(true);
                        setDisplayQuestions(true);
                      }, 350);
                    }}
                  >
                    <AlarmIcon
                      sx={{
                        fontSize: `${timerSize}px`,
                      }}
                    />
                  </IconButton>
                ) : (
                  <div
                    onClick={() => {
                      if (answeredQuestion) {
                        return;
                      }
                      setIsTimerRunning(!isTimerRunning);
                      toggleAudio();
                    }}
                  >
                    <CountdownCircleTimer
                      isPlaying={isTimerRunning}
                      strokeLinecap={"square"}
                      strokeWidth={15}
                      duration={30}
                      size={timerSize}
                      colors={["#ff7171", "#ff5858", "#A30000", "#A30000"]}
                      colorsTime={[30, 10, 5, 0]}
                      onComplete={(_) => {
                        setAnsweredQuestion(true);
                        setAnswer("");
                        setPlayYouLose(true);
                        updateStats(questions[currentQuestionIndex].who, false);
                      }}
                    >
                      {({ remainingTime }) =>
                        remainingTime > 0 ? remainingTime : "נגמר הזמן!"
                      }
                    </CountdownCircleTimer>
                  </div>
                )}
              </Box>
            </>
            {answeredQuestion && (
              <>
                {answer && (
                  <Typography
                    variant="h6"
                    component="h2"
                    color={
                      questions[currentQuestionIndex].answers.indexOf(answer) ==
                      questions[currentQuestionIndex].correct
                        ? "success"
                        : "error"
                    }
                    sx={{
                      mt: 1,
                      textDecoration: "underline",
                      opacity: opacity,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  >
                    {indexToLetter(
                      questions[currentQuestionIndex].answers.indexOf(answer)
                    )}
                    &nbsp;
                    {answer}
                  </Typography>
                )}
                {questions[currentQuestionIndex].answers.indexOf(answer) !=
                  questions[currentQuestionIndex].correct && (
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mt: 2,
                      opacity: opacity,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  >
                    התשובה הנכונה היא:
                    <br />
                    <b>
                      {indexToLetter(questions[currentQuestionIndex].correct)}
                      &nbsp;
                      {
                        questions[currentQuestionIndex].answers[
                          questions[currentQuestionIndex].correct
                        ]
                      }
                    </b>
                  </Typography>
                )}
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    opacity: opacity,
                    transition: "opacity 0.5s ease-in-out",
                  }}
                  onClick={() => {
                    setAnsweredQuestion(false);
                    setDisplayQuestions(false);
                    setTimer(false);
                    setTimerOpacity(1);
                    muteAllAudio();
                    console.log("here", currentQuestionIndex, questions.length);
                    if (currentQuestionIndex >= questions.length - 1) {
                      console.log("should navigate");
                      navigate("/stats");
                    } else {
                      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    }
                  }}
                >
                  שאלה הבאה
                </Button>
              </>
            )}
            {/* <Box
              sx={{
                width: "50%",
                height: "10px",
                mt: 2,
                position: "absolute",
                bottom: "20px",
              }}
            >
              <Typography
                sx={{
                  position: "absolute",
                  left: "10%",
                  bottom: "20px",
                }}
              >
                🍺
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  left: "30%",
                  bottom: "20px",
                }}
              >
                🍺🍺
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  left: "70%",
                  bottom: "20px",
                }}
              >
                🍺🍺🍺
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(currentQuestionIndex / questions.length) * 100}
              />
            </Box> */}
          </Box>
        )}
      </Box>
    </Container>
  );
}
