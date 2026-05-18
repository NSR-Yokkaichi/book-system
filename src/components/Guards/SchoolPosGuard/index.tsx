"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SchoolPosGuard({
  children,
  pos,
}: {
  children: React.ReactNode;
  pos: {
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
  } | null;
}) {
  const [inProgress, setInProgress] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    const checkLocation = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        if (permission.state === "denied") {
          setIsPopupOpen(true);
          return;
        }

        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
            });
          },
        );

        const { latitude, longitude } = position.coords;

        if (
          pos &&
          (latitude < pos.minLatitude ||
            latitude > pos.maxLatitude ||
            longitude < pos.minLongitude ||
            longitude > pos.maxLongitude) &&
          process.env.NODE_ENV === "production"
        ) {
          setIsPopupOpen(true);
          return;
        }

        setIsPopupOpen(false);
      } catch {
        setIsPopupOpen(true);
      }
    };

    checkLocation();
    setInProgress(false);
  }, [pos]);
  return (
    <>
      {!isPopupOpen && !inProgress && children}
      <GuardPopup open={isPopupOpen} />
    </>
  );
}

function GuardPopup({ open }: { open: boolean }) {
  const router = useRouter();
  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogContent>
        <Typography variant="h6" component="h2">
          位置情報の確認
        </Typography>
        <Typography variant="body1" component="p">
          位置情報が確認できないか、学校の位置情報の範囲外にいるようです。場所を確認してください。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            router.push("/");
          }}
        >
          ホームへ
        </Button>
        <Button
          onClick={() => {
            router.refresh();
          }}
        >
          再試行
        </Button>
      </DialogActions>
    </Dialog>
  );
}
