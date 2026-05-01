"use client";

import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { regist } from "./action";

export default function NewBookClient({
  title,
  isbn,
  author,
  publisher,
  rakutenLinked,
}: {
  title?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  rakutenLinked?: string;
}) {
  const [inProgress, setInProgress] = useState(false);
  const router = useRouter();
  return (
    <Stack
      component="form"
      spacing={2}
      mt={4}
      maxWidth="400px"
      action={async (formdata: FormData) => {
        setInProgress(true);
        await regist(formdata);
        setInProgress(false);
        router.push("/admin/books");
      }}
    >
      <TextField
        label="本の名前"
        name="name"
        required
        fullWidth
        defaultValue={title}
      />
      <TextField
        label="ISBN"
        name="isbn"
        required
        fullWidth
        defaultValue={isbn}
      />
      <Button
        variant="outlined"
        href={`/admin/books/new?auto=1${isbn ? `&isbn=${isbn}` : ""}`}
      >
        ISBNバーコードで登録
      </Button>
      <TextField label="著者" name="author" fullWidth defaultValue={author} />
      <TextField
        label="出版社"
        name="publisher"
        fullWidth
        defaultValue={publisher}
      />
      <TextField label="ステッカーID" name="stickerId" fullWidth />
      <FormControlLabel
        control={
          <Checkbox
            name="rakutenLinked"
            defaultChecked={["1", "true", "on"].includes(rakutenLinked ?? "")}
          />
        }
        label="楽天ブックスに登録されています"
      />
      <FormHelperText>
        楽天ブックスに登録されている本の場合、チェックボックスをオンにすると書影が登録できます。
      </FormHelperText>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={inProgress}
      >
        登録
      </Button>
    </Stack>
  );
}
