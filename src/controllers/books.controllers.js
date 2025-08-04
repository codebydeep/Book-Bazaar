import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Book from "../models/books.model.js";

const addBook = asyncHandler(async (req, res) => {
  const { 
    title, 
    author, 
    description, 
    price 
  } = req.body;

  if (!title || !author || !description || !price) {
    return res
      .status(400)
      .json(new ApiError(400, ["All the details are required!"]));
  }

  const existingBook = await Book.findOne({
    $or: [{ title }, { author }],
  });

  if (existingBook) {
    return res
      .status(400)
      .json(new ApiError(400, ["Similar kind of Book is already exists~"]));
  }

  const book = await Book.create({
    title,
    author,
    description,
    price,
    addedBy: req.user._id,
  });

  await book.save();

  res.status(201).json(new ApiResponse(201, "Book added Successfully", book));
});

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({});

  res
    .status(201)
    .json(new ApiResponse(201, "Books fetched Successfully!", { books }));
});

const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  res.status(201).json(
    new ApiResponse(201, "Book fetch Done!", { book })
  );
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { title, author, description, price } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    return res.status(401).json(new ApiError(400, false, ["No Book found"]));
  }

  if (title) book.title = title;
  if (author) book.author = author;
  if (description) book.description = description;
  if (price) book.price = price;

  await book.save();

  res
    .status(201)
    .json(
        new ApiResponse(201, "Book update Successfully", { book })
    );
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findByIdAndDelete(id);

  if (!book) {
    return res.status(400).json(
        new ApiError(400, false, ["Book not found"])
    );
  }

  res
    .status(201)
    .json(
        new ApiResponse(201, "Book deleted Successfully", { book })
    );
});

export { 
    addBook, 
    getBooks, 
    getBookById, 
    updateBook, 
    deleteBook 
};
