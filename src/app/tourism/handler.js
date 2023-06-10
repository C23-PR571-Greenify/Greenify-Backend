const { default: axios } = require("axios");
const {
  Tourism,
  Categories,
  Category,
  tourism_image,
  users_rating,
} = require("../../models");
const models = require("../../models");
const { respone } = require("../../utils/response");
const { storageService } = require("../../utils/storageService");
const { respone } = require("../../utils/response");
const sequelize = require("sequelize");

async function getAllTourismHandler(req, res, next) {
  try {
    const tourisms = await Tourism.findAll({
      include: [
        {
          model: models.Category,
        },
        {
          model: models.tourism_image,
        },
      ],
    });
    res
      .status(200)
      .json(respone("Berhasil mendapatkan semua tourism", tourisms));
  } catch (error) {
    next(error);
  }
}

async function getSingleTourismHandler(req, res, next) {
  try {
    const tourism = await Tourism.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: models.Category,
        },
        {
          model: models.tourism_image,
        },
      ],
    });
    res.status(200).json(respone("Berhasil mendapatkan tourism", tourism));
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
    res.status(201).json(respone("Berhasil menambahkan tourism", tourism));
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
    res.status(201).json(respone("Berhasil mengubah tourism", tourism));
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
    res.status(201).json(respone("Berhasil menghapus tourism", tourism));
  } catch (error) {
    next(error);
  }
}

async function predictTourismHandler(req, res, next) {
  try {
    const tourism = await Tourism.findAll();
    const categories = await Category.findAll({
      attributes: ["average_rating"],
    });

    const averageRatings = [];

    for (const category of categories) {
      const averageRating = category.average_rating;
      averageRatings.push(averageRating);
    }

    // console.log(averageRatings);

    const body = {
      user_feature: [averageRatings],
      tempat_feature: tourism.map((item) => [
        item.rating,
        item.price,
        item.lat,
        item.lng,
        item.category_id,
      ]),
    };

    const recommendation = await axios.post(
      `https://greenify-predict-ernafpm2wq-as.a.run.app/prediksi`,
      body
    );

    const resultTourism = recommendation.data.map((item) => tourism[item]);

    res
      .status(200)
      .json(respone("Berhasil mendapatkan rekomendasi", resultTourism));
  } catch (error) {
    next(error);
  }
}

async function uploadImageHandler(req, res, next) {
  try {
    const images = req.files;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const url = await storageService.store(image, "tourism/");
      await tourism_image.create({
        tourism_id: req.params.id,
        image_url: url,
      });
    }

    res.status(200).json(respone("Berhasil upload image"));
  } catch (error) {
    next(error);
  }
}

async function giveRatingTourism(req, res) {
  const { user_id, tourism_id, rating } = req.body;
  const categoriesData = await Category.findAll();
  const singleTourism = await Tourism.findOne({
    attributes: ["id", "category_id", "place_name"],
    where: {
      id: tourism_id,
    },
  });

  try {
    await users_rating.create({
      user_id: user_id,
      tourism_id: tourism_id,
      rating: rating ? rating : 0.0,
    });

    for (const category of categoriesData) {
      const categoryId = category.id;

      const wisata = await Tourism.findAll({
        where: {
          category_id: categoryId,
        },
        attributes: ["id"],
        raw: true,
      });

      const tourismId = wisata.map((item) => item.id);
      const result = await users_rating.findOne({
        attributes: [
          [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
        ],
        where: { tourism_id: tourismId },
        raw: true,
      });

      const averageRating = result.average_rating;

      await Category.update(
        { average_rating: averageRating ? averageRating : 0.0 },
        { where: { id: categoryId } }
      );
    }

    res.status(201).json({
      error: false,
      msg: "Berhasil menambahkan rating",
      tourism: singleTourism,
    });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getAllTourismHandler,
  getSingleTourismHandler,
  createTourismHandler,
  updateTourismHandler,
  deleteTourismHandler,
  predictTourismHandler,
  uploadImageHandler,
  giveRatingTourism,
};
