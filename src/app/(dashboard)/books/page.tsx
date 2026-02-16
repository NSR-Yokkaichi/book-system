import { Book } from "@/class/Book";
import { Stack } from "@mui/material";
import { bnBD } from "@mui/material/locale";

export default async function BooksPage() {
  //const books = await Book.findAll();
  const books = [
    {
      id: "1",
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
    },
    {
      id: "1",
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
    },
  ];
  return (
    <Stack>
      {books.map((book) => (
        <div key={book.id}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
          <p>{book.isbn}</p>
        </div>
      ))}
    </Stack>
  );
}
