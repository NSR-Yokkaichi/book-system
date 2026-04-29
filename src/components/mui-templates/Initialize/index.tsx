"use client";
import { Divider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";
import { authClient } from "@/lib/auth-client";
import AppTheme from "../shared-theme/AppTheme";
import { createAdmin, createCampus } from "./actions";
import { SitemarkIcon } from "./components/CustomIcons";

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

export default function Initialize(props: { disableCustomTheme?: boolean }) {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [campusName, setCampusName] = React.useState("");
  const [rentalDeadline, setRentalDeadline] = React.useState(14);

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== confirmPassword)
      enqueueSnackbar("パスワードとパスワードの確認が一致していません", {
        variant: "error",
      });
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email))
      enqueueSnackbar("有効なメールアドレスを入力してください", {
        variant: "error",
      });
    try {
      await createAdmin(email, username, password);
      await createCampus(campusName, rentalDeadline);
      await authClient.signIn.username({
        username,
        password,
      });
      router.push("/admin?initialized=true");
    } catch (e) {
      if (e instanceof Error && e.name === "APIError") {
        enqueueSnackbar(e.message, { variant: "error" });
        return;
      }
      enqueueSnackbar("エラーが発生しました。管理者にお問い合わせください", {
        variant: "error",
      });
    }
  };
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              wordBreak: "keep-all",
            }}
          >
            BookSystemを
            <wbr />
            インストール
          </Typography>
          <Typography variant="body2" color="text.secondary">
            図書管理システムを初期化します。
          </Typography>
          <Divider>初期ユーザーの情報を入力</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="ユーザー名"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="パスワード"
              type="password"
              autoComplete={"new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={
                confirmPassword !== password &&
                confirmPassword !== "" &&
                password !== ""
              }
              fullWidth
            />
            <TextField
              label="パスワードの確認"
              type="password"
              autoComplete={"new-password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                confirmPassword !== password &&
                confirmPassword !== "" &&
                password !== ""
              }
              helperText={
                confirmPassword !== password &&
                confirmPassword !== "" &&
                password !== "" &&
                "パスワードが一致しません"
              }
              fullWidth
            />
            <Divider>キャンパスの情報</Divider>
            <TextField
              label="キャンパス名"
              type={"text"}
              autoComplete="organization"
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
            />
            <TextField
              label="返却期限(日)"
              type={"number"}
              value={rentalDeadline}
              onChange={(e) => setRentalDeadline(Number(e.target.value))}
            />
            <Button
              fullWidth
              variant="outlined"
              disabled={
                !username ||
                !password ||
                !confirmPassword ||
                !campusName ||
                !rentalDeadline ||
                !email
              }
              onClick={handleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            >
              初期化を実行
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
