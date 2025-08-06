import Review from "../models/review.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Book from "../models/books.model.js";

const addReviewForBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { description, rating } = req.body;

  if (!description || !rating) {
    return res
      .status(400)
      .json(new ApiError(400, false, ["Give required details!"]));
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(400).json(new ApiError(400, false, ["Book not found~"]));
  }

  const review = await Review.create({
    user: req.user._id,
    book: bookId,
    description,
    rating,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Review added Successfully!", review));
});

const getAllReviewsForBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const reviews = await Review.find({
    book: bookId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Reviews fetched Successfully", reviews));
});

const deleteReviewForBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return res
      .status(400)
      .json(new ApiError(400, false, ["Review not found~"]));
  }

  res.status(201).json(new ApiResponse(201, "Review deleted successfully!", {review}));
});

export { 
    addReviewForBook, 
    getAllReviewsForBook, 
    deleteReviewForBook 
};
