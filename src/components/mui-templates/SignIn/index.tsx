"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import { GoogleIcon, SitemarkIcon } from "./components/CustomIcons";
import PasswordIcon from "@mui/icons-material/Password";
import { Divider, Link, TextField } from "@mui/material";
import { authClient } from "@/lib/auth-client";
import React from "react";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Book-systemにログイン
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={async () => {
                await authClient.signIn.social({ provider: "google" });
              }}
              startIcon={<GoogleIcon />}
            >
              nnn.ed.jpでログイン
            </Button>
          </Box>
          <Divider sx={{ my: 2 }}> もしくは </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Link href="/signin/admin">
              <Button fullWidth variant="outlined" startIcon={<PasswordIcon />}>
                管理者としてログイン
              </Button>
            </Link>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}

export function SignInWithPassword() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in as admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            管理者としてBook-systemにログイン
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Username / Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              fullWidth
              variant="outlined"
              disabled={!username || !password}
              onClick={async () => {
                // @を含むか
                if (username.includes("@")) {
                  await authClient.signIn.email({
                    email: username,
                    password,
                  });
                } else {
                  await authClient.signIn.username({
                    username: username,
                    password: password,
                  });
                }
              }}
            >
              管理者としてログイン
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
