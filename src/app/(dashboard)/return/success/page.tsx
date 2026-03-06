"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function ReturnSuccessPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 64,
                color: "success.main",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            返却が完了しました
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
            本の返却が正常に完了しました。ご利用ありがとうございました。
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              fullWidth
              startIcon={<HomeIcon />}
            >
              ダッシュボードに戻る
            </Button>
          </Stack>
        </Card>
      </Box>
    </Container>
  );
}
