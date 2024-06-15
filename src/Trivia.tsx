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
import Irur from "./irur";

interface TriviaQuestion {
  question: string;
  answers: string[];
  who: string;
  photo?: string;
  hasPhotoAnswer?: boolean;
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

export default function Trivia() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const timerSize: number = isSmall ? 90 : 180;
  const query = useQuery({
    queryKey: ["trivia"],
    queryFn: async () => {
      const response = await fetch(
        // "https://api.npoint.io/4f83648c8dc8b1c9438a"
        "trivia.json"
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
  const [displayQuestions, setDisplayQuestions] = useState(false);

  const [adminIndex, setAdminIndex] = useState(0);

  useEffect(() => {
    if (query.isSuccess && questions.length === 0) {
      if (ENABLE_ADMIN) {
        setQuestions(query.data.questions);
      } else {
        let indexOfFirstSunnyQuestion = query.data.questions.findIndex(
          (question: TriviaQuestion) => question.who === "סאני"
        );
        setQuestions(
          // shuffle all the list of questions from 2 to 20, but make sure that 8 and 9 remain adjacent
          query.data.questions
            .slice(0, 2)
            .concat(
              query.data.questions.slice(2, 8).sort(() => Math.random() - 0.5)
            )
            .concat(query.data.questions.slice(8, 10))
            .concat(
              query.data.questions
                .slice(10, indexOfFirstSunnyQuestion)
                .sort(() => Math.random() - 0.5)
            )
            .concat(query.data.questions.slice(indexOfFirstSunnyQuestion))
        );
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
          <source src="ahuzon_elion.mp3" type="audio/mpeg" />
        </audio>
      )}
      {playYouLose && (
        <audio autoPlay>
          <source src="you_lose.wav" type="audio/mpeg" />
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
                  src={questions[currentQuestionIndex].photo}
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
                            backgroundColor: "#836400",
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
                      colors={["#cf9f00", "#cf9f00", "#A30000", "#A30000"]}
                      colorsTime={[30, 10, 5, 0]}
                      onComplete={(_) => {
                        setAnsweredQuestion(true);
                        setAnswer("");
                        setPlayYouLose(true);
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
                  <>
                    <Typography
                      variant="h5"
                      component="h2"
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
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        mt: 2,
                        opacity: opacity,
                        transition: "opacity 0.5s ease-in-out",
                      }}
                    >
                      {questions[currentQuestionIndex].who} יגיד לך אם צדקת
                    </Typography>
                    <Irur answer={answer}></Irur>
                  </>
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
                    setCurrentQuestionIndex(
                      (prevIndex) => (prevIndex + 1) % questions.length
                    );
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
