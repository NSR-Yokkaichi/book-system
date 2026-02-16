"use client";
import { authClient } from "@/lib/auth-client";
import { Card, Typography, Box, Button } from "@mui/material";
import { SitemarkIcon } from "./components/CustomIcons";

export function SignInWithPasswordClient() {
  return (
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
        <Button
          fullWidth
          variant="outlined"
          onClick={async () => {
            await authClient.signIn.emailAndPassword({
              email: "admin@example.com",
              password: "password",
            });
          }}
        >
          管理者としてログイン
        </Button>
      </Box>
    </Card>
  );
}
