import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

import bcrypt from "bcryptjs";
import ApiKey from "../models/apiKey.model.js";

const keyMiddleware = asyncHandler(async (req, res, next) => {
  const key = req.headers["api-key"];

  if (!key) {
    return res
      .status(400)
      .json(new ApiError(400, 
        false, 
        ["No Api-Key in [Headers]"]
    ));
  }

  const getKey = await ApiKey.find({});

  let matchedUser = null;

  for (const entry of getKey) {
    const isMatched = await bcrypt.compare(key, entry.apiKey);

    if (isMatched) {
      matchedUser = entry.user;
      break;
    }
  }

  if (!matchedUser) {
    return res
      .status(400)
      .json(new ApiError(400, 
        false, 
        ["No Api-Key present~"]
    ));
}

  req.user = matchedUser;
  next();
});

export default keyMiddleware;