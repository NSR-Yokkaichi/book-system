"use client";

import {
  Button,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { type FormEvent, useState } from "react";
import type { CampusConfigPlain } from "@/class/Campus";
import { updateCampus } from "./action";

export default function CampusPageClient({
  campusConfig,
}: {
  campusConfig: CampusConfigPlain[]; // サーバーからはプレーンなオブジェクト配列で届く
}) {
  const { enqueueSnackbar } = useSnackbar();

  // stateにはプレーンなオブジェクトを保存
  const [configs, setConfigs] = useState<CampusConfigPlain[]>(campusConfig);

  const getCurrentValue = (key: string) => {
    return configs.find((config) => config.key === key)?.value || "";
  };

  const onChangeValue = (key: string, value: string) => {
    setConfigs((prev) => {
      const index = prev.findIndex((c) => c.key === key);

      if (index !== -1) {
        // 既存の更新（スプレッド演算子で新しいプレーンオブジェクトを作成）
        const nextConfigs = [...prev];
        nextConfigs[index] = {
          ...prev[index],
          value,
          updatedAt: new Date(),
        };
        return nextConfigs;
      } else {
        // 新規追加（クラスではなくオブジェクトリテラルで）
        return [
          ...prev,
          {
            key,
            value,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 全ての値をループして更新
      const promises = configs.map((config) =>
        updateCampus(config.key, config.value),
      );

      await Promise.all(promises);
      enqueueSnackbar("設定を更新しました", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("更新に失敗しました", { variant: "error" });
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2}
      maxWidth="400px"
      bgcolor={"background.paper"}
      p={2}
      borderRadius={2}
      border={"1px solid #ccc"}
    >
      <TextField
        name="name"
        label="施設名"
        value={getCurrentValue("name")}
        onChange={(e) => onChangeValue("name", e.target.value)}
        required
      />

      <TextField
        name="rentalDeadline"
        label="返却期限(日)"
        type="number"
        value={getCurrentValue("rentalDeadline") || "14"}
        onChange={(e) => onChangeValue("rentalDeadline", e.target.value)}
      />

      <Divider />

      <FormControlLabel
        control={
          <Switch
            checked={getCurrentValue("adminCanRental") === "true"}
            onChange={(e) =>
              onChangeValue("adminCanRental", String(e.target.checked))
            }
          />
        }
        label="管理者は貸し出し可能か"
      />

      <FormControlLabel
        control={
          <Switch
            checked={getCurrentValue("isNNN") === "true"}
            onChange={(e) => onChangeValue("isNNN", String(e.target.checked))}
          />
        }
        label="N高グループモード"
      />

      <TextField
        name="authGoogleHD"
        label="Googleアカウントのドメイン"
        value={getCurrentValue("authGoogleHD")}
        onChange={(e) => onChangeValue("authGoogleHD", e.target.value)}
        helperText={
          "このドメインのみサインアップ等ができるように強制できます。"
        }
      />

      <Divider />

      <Typography variant="h6">キャンパスの位置</Typography>

      {[
        {
          name: "minLatitude",
          label: "緯度の下限",
          help: "これより緯度が低い場所ではサインアップを受け付けません。",
        },
        {
          name: "maxLatitude",
          label: "緯度の上限",
          help: "これより緯度が高い場所ではサインアップを受け付けません。",
        },
        {
          name: "minLongitude",
          label: "経度の下限",
          help: "これより経度が低い場所ではサインアップを受け付けません。",
        },
        {
          name: "maxLongitude",
          label: "経度の上限",
          help: "これより経度が高い場所ではサインアップを受け付けません。",
        },
      ].map((field) => (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          value={getCurrentValue(field.name)}
          onChange={(e) => onChangeValue(field.name, e.target.value)}
          helperText={field.help}
        />
      ))}

      <Button type="submit" variant="contained" color="primary">
        更新
      </Button>
    </Stack>
  );
}
