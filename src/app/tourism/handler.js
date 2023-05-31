const { Tourism } = require("../../models");

async function getAllTourismHandler(req, res, next) {
  try {
    const tourisms = await Tourism.findAll();
    res.status(200).json({ data: tourisms });
  } catch (error) {
    next(error);
  }
}

async function getSingleTourismHandler(req, res, next) {
  try {
    const tourism = await Tourism.findOne({
      where: {
        tourism_id: req.params.id,
      },
    });
    res.status(200).json({ data: tourism });
  } catch (error) {
    next(error);
  }
}

async function createTourismHandler(req, res, next) {
  try {
    const tourism = await Tourism.create({
      place_name: req.body.place_name,
      description: req.body.description,
      category_id: req.body.category_id,
      city: req.body.city,
      price: req.body.price,
      rating: req.body.rating,
      lat: req.body.lat,
      lng: req.body.lng,
    });
    res.status(201).json({ data: tourism });
  } catch (error) {
    next(error);
  }
}

async function updateTourismHandler(req, res, next) {
  try {
    const tourism = await Tourism.update(req.body, {
      where: {
        tourism_id: req.params.id,
      },
    });
    res.status(201).json({ data: tourism });
  } catch (error) {
    next(error);
  }
}

async function deleteTourismHandler(req, res, next) {
  try {
    const tourism = await Tourism.destroy({
      where: {
        tourism_id: req.params.id,
      },
    });
    res.status(201).json({ data: tourism });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTourismHandler,
  getSingleTourismHandler,
  createTourismHandler,
  updateTourismHandler,
  deleteTourismHandler,
};
