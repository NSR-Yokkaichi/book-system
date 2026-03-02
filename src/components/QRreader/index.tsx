"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./style.css";
import { borrowAction } from "./action";

export default function QrCameraScanner({
  mode,
}: {
  mode: "borrow" | "return";
}) {
  const [scanResult, setScanResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const qrRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          setError("カメラが見つかりませんでした 😢");
          return;
        }

        const cameraId = cameras[0].id;

        qrRef.current = new Html5Qrcode("qr-reader");

        await qrRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setScanResult(decodedText);
          },
          (errorMessage) => {
            // 読み取り失敗は無視でOK（ログ出すならここ）
            console.log(errorMessage);
          },
        );
      } catch (err) {
        setError("カメラ起動に失敗しました 📸");
      }
    };

    startScanner();

    return () => {
      if (qrRef.current) {
        qrRef.current.stop().then(() => {
          qrRef.current?.clear();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (scanResult && mode === "borrow") {
      borrowAction(scanResult);
    }
  }, [scanResult, mode]);

  return (
    <div className="qr-uploader">
      <div className="sparkles"></div>

      <div className="qr-content">
        {error && <p className="error-message">{error}</p>}
        {scanResult && <p className="success-message">ISBN: {scanResult}</p>}

        <div id="qr-reader" style={{ width: "300px", margin: "0 auto" }} />
      </div>
    </div>
  );
}
