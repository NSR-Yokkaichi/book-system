"use client";

import { Button } from "@mui/material";
import { createSampleData } from "./action";

export default function SampleDataPage() {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          const result = await createSampleData();
          if (!result) {
            alert("Googleでログインを先にしてください。");
          }
        }}
      >
        サンプルデータを作成する
      </Button>
    </div>
  );
}
