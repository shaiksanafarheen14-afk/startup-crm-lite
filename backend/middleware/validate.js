import { validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param, // handles differences between express-validator versions
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  };
};
