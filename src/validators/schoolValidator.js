const { z } = require('zod');

// Schema for adding a new school
const addSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

// Middleware for validating add school request
const validateAddSchool = (req, res, next) => {
  try {
    // Attempt to parse and validate the request body
    // z.coerce is used in case user sends float as string (optional but good for robustness)
    const data = {
        name: req.body.name,
        address: req.body.address,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
    };
    
    req.body = addSchoolSchema.parse(data);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }))
      });
    }
    next(error);
  }
};

module.exports = {
  validateAddSchool
};
