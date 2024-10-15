import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CredentialResponse, useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import Redirect from "./Redirect";

interface DecodedUser {
  given_name: string;
}

export default function LandingPage() {
  const [header, setHeader] = useState<string>("האם אתה ליעד?");
  const [headerOpacity, setHeaderOpacity] = useState<number>(1);
  const [person, setPerson] = useState<String>("")
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLiad, setIsLiad] = useState<boolean>(false);
  const [credentialResponse, setCredentialResponse] =
    useState<CredentialResponse | null>();
  // const [triviaComplete, setTriviaComplete] = useState<boolean>(false);
  // const [statsData, setStatsData] = useState<StatsData>({ stats: [] });

  useMemo(() => {
    if (!credentialResponse?.credential) return;
    let decoded = jwtDecode<DecodedUser>(credentialResponse.credential);
    console.log(decoded)
    let isActuallyLiad = decoded.given_name.toLowerCase().includes("benny");
    setIsLiad(isActuallyLiad);
  }, [credentialResponse]);

  useGoogleOneTapLogin({
    cancel_on_tap_outside: false,
    onSuccess: (credentialResponse) => {
      setCredentialResponse(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  useEffect(() => {
    if (!credentialResponse) return;
    setTimeout(() => {
      setHeaderOpacity(0);
    });
    setTimeout(() => {
      setHeaderOpacity(1);
      if (isLiad) {
        setPerson("liad")
        setHeader("נראה שכן!");
      } else {
        setPerson("oren")
        setHeader("נראה שלא!");
      }
    }, 500);
    setTimeout(() => {
      setHeaderOpacity(0);
    }, 1750);
    setTimeout(() => {
      setHeaderOpacity(1);
      setHeader("הטריויליעדה");
      setIsReady(true);
    }, 2250);
  }, [isLiad, credentialResponse]);

  document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/*triviaComplete && (
        <audio autoPlay>
          <source src="complete.mp3" type="audio/mpeg" />
        </audio>
      )*/}
      <Typography
        variant="h2"
        component="h2"
        sx={{
          mb: 2,
          opacity: headerOpacity,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {header}
      </Typography>
      {isReady &&
        <Redirect to={`/${person}`} />
      }
    </Box>
  );
}
