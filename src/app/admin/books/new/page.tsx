import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Book } from "@/class/Book";
import { regist } from "./action";

export default function NewBookPage() {
  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        新しい本を登録
      </Typography>
      <Typography variant="body1">
        こちらのフォームから新しい本を登録できます。
      </Typography>
      <Stack
        component="form"
        spacing={2}
        mt={4}
        maxWidth="400px"
        action={regist}
      >
        <TextField label="本の名前" name="name" required fullWidth />
        <TextField label="ISBN" name="isbn" required fullWidth />
        <TextField label="著者" name="author" fullWidth />
        <TextField label="出版社" name="publisher" fullWidth />
        <TextField label="ステッカーID" name="sticker_id" fullWidth />
        <Button type="submit" variant="contained" color="primary">
          登録
        </Button>
      </Stack>
    </Stack>
  );
}
