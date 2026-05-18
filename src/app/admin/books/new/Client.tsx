"use client";

import {
  Alert,
  type AlertColor,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { isNeedWarn, regist } from "./action";

export default function NewBookClient({
  title: initialTitle = "",
  isbn: initialIsbn = "",
  jan: initialJan = "",
  author: initialAuthor = "",
  publisher: initialPublisher = "",
  publishedAt: initialPublishedAt,
  rakutenLinked: initialRakutenLinked,
}: {
  title?: string;
  isbn?: string;
  jan?: string;
  author?: string;
  publisher?: string;
  publishedAt?: Date;
  rakutenLinked?: string;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [inProgress, setInProgress] = useState(false);
  const [resolvedWarning, setResolvedWarning] = useState(false);
  const [warning, setWarning] = useState<{
    message: string;
    severity: AlertColor;
  } | null>(null);
  const router = useRouter();

  const formatDate = (date: Date, sep = "") =>
    date.getFullYear() +
    sep +
    `00${date.getMonth() + 1}`.slice(-2) +
    sep +
    `00${date.getDate()}`.slice(-2);

  // --- 入力状態を管理 ---
  const [values, setValues] = useState({
    title: initialTitle,
    isbn: initialIsbn,
    jan: initialJan,
    author: initialAuthor,
    publisher: initialPublisher,
    publishedAt: initialPublishedAt
      ? formatDate(initialPublishedAt, "-")
      : undefined,
    rakutenLinked: initialRakutenLinked,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // --- 動的にURLを生成する関数 ---
  const getAutoFillUrl = (autoType: number) => {
    const params = new URLSearchParams();
    params.append("auto", autoType.toString());

    // 現在の状態（values）からパラメータを構築
    if (values.title) params.append("title", values.title);
    if (values.isbn) params.append("isbn", values.isbn);
    if (values.jan) params.append("jan", values.jan);
    if (values.author) params.append("author", values.author);
    if (values.publisher) params.append("publisher", values.publisher);
    if (values.publishedAt) params.append("publishedAt", values.publishedAt);
    if (values.rakutenLinked)
      params.append("rakutenLinked", values.rakutenLinked);

    return `/admin/books/new?${params.toString()}`;
  };

  return (
    <Stack
      component="form"
      spacing={2}
      mt={4}
      maxWidth="400px"
      action={async (formdata: FormData) => {
        setInProgress(true);
        if (!resolvedWarning) {
          const warning = await isNeedWarn(formdata);
          if (warning) {
            setWarning(warning);
            setInProgress(false);
            return;
          }
        }
        try {
          await regist(formdata);
          router.push("/admin/books");
        } catch {
          enqueueSnackbar("登録に失敗しました。入力内容を確認してください。", {
            variant: "error",
          });
        } finally {
          setInProgress(false);
        }
      }}
    >
      <Button variant="outlined" href={getAutoFillUrl(1)}>
        ISBN/書籍・定期刊行物JANバーコードで自動入力
      </Button>

      <TextField
        label="本の名前"
        name="title"
        required
        fullWidth
        value={values.title}
        onChange={handleChange}
      />

      <TextField
        label="ISBN"
        name="isbn"
        fullWidth
        value={values.isbn}
        onChange={handleChange}
      />

      <Button variant="outlined" href={getAutoFillUrl(2)}>
        ISBNバーコードを読み取り
      </Button>

      <TextField
        label="書籍・定期刊行物 JAN"
        name="jan"
        fullWidth
        value={values.jan}
        onChange={handleChange}
      />

      <Button variant="outlined" href={getAutoFillUrl(3)}>
        書籍・定期刊行バーコードを読み取り
      </Button>

      <TextField
        label="著者"
        name="author"
        fullWidth
        value={values.author}
        onChange={handleChange}
      />

      <TextField
        label="出版社"
        name="publisher"
        fullWidth
        value={values.publisher}
        onChange={handleChange}
      />

      <TextField
        label="出版年月日"
        name="publishedAt"
        fullWidth
        value={values.publishedAt}
        type={"date"}
        onChange={handleChange}
      />

      <TextField
        label="ステッカーID"
        name="stickerId"
        fullWidth
        helperText={"本に対する一意の番号です"}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="rakutenLinked"
            defaultChecked={["1", "true", "on"].includes(
              initialRakutenLinked ?? "",
            )}
          />
        }
        label="楽天ブックスに登録されています"
      />
      <FormHelperText>
        楽天ブックスに登録されている本の場合、チェックボックスをオンにすると書影が登録できます。
      </FormHelperText>
      <Button
        type={"submit"}
        variant={"contained"}
        color="primary"
        disabled={inProgress}
      >
        登録
      </Button>
      <Dialog open={warning !== null} onClose={() => setWarning(null)}>
        <DialogContent>
          <Alert variant={"filled"} severity={warning?.severity || "info"}>
            {warning?.message}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarning(null)}>キャンセル</Button>
          <Button onClick={() => setResolvedWarning(true)} type={"submit"}>
            登録する
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
