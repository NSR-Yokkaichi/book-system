"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { CircularProgress, Stack } from "@mui/material";
import ISBN from "isbn3";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { getBookInfoFromISBN } from "@/lib/rakutenAPI";
import { borrowAction, returnAction } from "./action";

function getCameraErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("notallowederror") ||
    lowerMessage.includes("permission") ||
    lowerMessage.includes("denied")
  ) {
    return "カメラ権限が拒否されています。ブラウザ設定で許可して再読み込みしてね";
  }

  if (
    lowerMessage.includes("notfounderror") ||
    lowerMessage.includes("no camera") ||
    lowerMessage.includes("devices not found")
  ) {
    return "カメラが見つかりませんでした";
  }

  if (
    lowerMessage.includes("notreadableerror") ||
    lowerMessage.includes("could not start video source")
  ) {
    return "カメラが他アプリで使用中かも。Zoomなどを閉じて再試行してね";
  }

  if (
    lowerMessage.includes("secure context") ||
    lowerMessage.includes("https")
  ) {
    return "カメラ利用には HTTPS または localhost が必要です";
  }

  return "カメラ起動に失敗しました";
}

function isRetryableScannerStateError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message
    .toLowerCase()
    .includes("cannot stop, scanner is not running or paused");
}

async function safeStopAndClearScanner(scanner: Html5Qrcode) {
  try {
    await scanner.stop();
  } catch (error) {
    if (!isRetryableScannerStateError(error)) {
      throw error;
    }
  } finally {
    scanner.clear();
  }
}

export default function QrCameraScanner({
  mode,
}: {
  mode: "borrow" | "return" | "register";
}) {
  const [scanResult, setScanResult] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const lastSubmittedRef = useRef<string>("");
  const [error, setError] = useState<string>("");
  const qrRef = useRef<Html5Qrcode | null>(null);
  const readerElementRef = useRef<HTMLDivElement | null>(null);
  const isStartingRef = useRef(false);
  const isMountedRef = useRef(false);
  const startAttemptIdRef = useRef(0);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string>("");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const startScanner = useCallback(async () => {
    let shouldRetry = false;

    if (isStartingRef.current || qrRef.current) return;
    isStartingRef.current = true;
    const attemptId = ++startAttemptIdRef.current;
    setIsScannerReady(false);
    setError("");
    setDebugMessage("");

    try {
      const readerElement = readerElementRef.current;
      if (!readerElement) {
        setError("カメラ表示領域の初期化に失敗しました");
        setDebugMessage("reader element ref is null: qr-reader");
        return;
      }

      if (!isMountedRef.current || attemptId !== startAttemptIdRef.current)
        return;

      // 再起動時に前回DOMが残っていると崩れるため明示的にクリア
      readerElement.innerHTML = "";

      const scanner = new Html5Qrcode("qr-reader");
      qrRef.current = scanner;

      const scanConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      const onScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
      };

      const onScanError = () => {
        // 読み取り失敗は無視（1フレームごとに高頻度で呼ばれるため）
      };

      const cameras = await Html5Qrcode.getCameras();
      if (!isMountedRef.current || attemptId !== startAttemptIdRef.current)
        return;

      const preferredCamera =
        cameras.find((camera) =>
          /(back|rear|environment|背面)/i.test(camera.label),
        ) ?? cameras[0];

      if (!preferredCamera) {
        throw new Error("No camera found");
      }

      try {
        await scanner.start(
          preferredCamera.id,
          scanConfig,
          onScanSuccess,
          onScanError,
        );
      } catch (firstStartError) {
        setDebugMessage(
          `deviceId起動失敗: ${
            firstStartError instanceof Error
              ? firstStartError.message
              : String(firstStartError)
          }`,
        );
        // 端末によっては deviceId 指定で失敗するため constraints で再試行
        await scanner.start(
          { facingMode: "environment" },
          scanConfig,
          onScanSuccess,
          onScanError,
        );
      }

      setIsScannerReady(true);
    } catch (e) {
      if (isRetryableScannerStateError(e)) {
        setError("カメラ初期化が競合したため再試行します...");
        setDebugMessage(e instanceof Error ? e.message : String(e));
        shouldRetry = true;
      } else {
        setError(getCameraErrorMessage(e));
        setDebugMessage(e instanceof Error ? e.message : String(e));
      }

      const scanner = qrRef.current;
      qrRef.current = null;
      if (scanner) {
        await safeStopAndClearScanner(scanner).catch(() => {
          scanner.clear();
        });
      }
    } finally {
      isStartingRef.current = false;

      if (
        shouldRetry &&
        isMountedRef.current &&
        attemptId === startAttemptIdRef.current
      ) {
        window.setTimeout(() => {
          if (
            isMountedRef.current &&
            attemptId === startAttemptIdRef.current &&
            !qrRef.current
          ) {
            void startScanner();
          }
        }, 250);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void startScanner();

    const handleFocus = () => {
      void startScanner();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void startScanner();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      startAttemptIdRef.current += 1;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [startScanner]);

  useEffect(() => {
    return () => {
      const scanner = qrRef.current;
      qrRef.current = null;

      if (scanner) {
        void safeStopAndClearScanner(scanner).catch(() => {
          scanner.clear();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (submitting || lastSubmittedRef.current === scanResult) return;
    if (ISBN.audit(scanResult).validIsbn === false) {
      return;
    } else {
      setSubmitting(true);
    }
    lastSubmittedRef.current = scanResult;
    if (scanResult && mode === "borrow") {
      void borrowAction(scanResult).catch((e) => {
        setError(e.message || "貸し出し処理に失敗しました");
        setSubmitting(false);
      });
    } else if (scanResult && mode === "return") {
      void returnAction(scanResult).catch((e) => {
        setError(e.message || "返却処理に失敗しました");
        setSubmitting(false);
      });
    } else if (scanResult && mode === "register") {
      void getBookInfoFromISBN(scanResult)
        .then((bookInfo) => {
          enqueueSnackbar("書籍情報の取得に成功しました！", {
            variant: "success",
          });
          router.push(
            `/admin/books/new?isbn=${scanResult}&title=${encodeURIComponent(bookInfo?.title ?? "")}&author=${encodeURIComponent(bookInfo?.author ?? "")}&publisher=${encodeURIComponent(bookInfo?.publisherName ?? "")}&rakutenLinked=on`,
          );
        })
        .catch((e) => {
          if (e instanceof Error && e.cause === "NOT_FOUND") {
            enqueueSnackbar(
              "書籍情報が見つかりませんでした。詳細情報は手動で入力してください。",
              {
                variant: "warning",
              },
            );
            router.push(`/admin/books/new?isbn=${scanResult}`);
            return;
          }
          console.log("Error fetching book info:", e);
          enqueueSnackbar("書籍情報の取得に失敗しました", {
            variant: "error",
          });
          setSubmitting(false);
        });
    }
  }, [scanResult, mode, submitting, router, enqueueSnackbar]);

  return (
    <div className="qr-uploader">
      <div className="sparkles"></div>

      <div className="qr-content">
        {error && <p className="error-message">{error}</p>}
        {debugMessage && (
          <p className="error-message" style={{ fontSize: "12px" }}>
            {debugMessage}
          </p>
        )}

        {!isScannerReady && (
          <button
            type="button"
            onClick={() => {
              void startScanner();
            }}
            disabled={isStartingRef.current}
            style={{
              marginBottom: "12px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            カメラ再試行
          </button>
        )}
        {submitting && (
          <Stack
            alignItems="center"
            marginBottom={2}
            position={"relative"}
            zIndex={1}
          >
            <CircularProgress />
            <span style={{ marginTop: "8px" }}>処理中...</span>
          </Stack>
        )}
        <div
          ref={readerElementRef}
          id="qr-reader"
          style={{ width: "300px", margin: "0 auto" }}
        />
      </div>
    </div>
  );
}
