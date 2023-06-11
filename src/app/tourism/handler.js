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
const sequelize = require("sequelize");

async function getAllTourismHandler(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: tourisms } = await Tourism.findAndCountAll({
      include: [
        {
          model: models.Category,
          attributes: ["id", "name", "description", "average_rating"],
        },
        {
          model: models.tourism_image,
          attributes: ["id", "image_url", "tourism_id"],
        },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(count / limit);
    const response = {
      message: "Berhasil mendapatkan semua tourism",
      data: tourisms,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    };

    res.status(200).json(response);
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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const tourism = await Tourism.findAll({
      offset: offset,
      limit: limit,
    });

    const categories = await Category.findAll({
      attributes: ["average_rating"],
    });

    const averageRatings = [];

    for (const category of categories) {
      const averageRating = category.average_rating;
      averageRatings.push(averageRating);
    }

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

    const recommendedIndexes = recommendation.data;
    const tourismIds = recommendedIndexes.map((index) => tourism[index].id);
    const imageUrls = await tourism_image.findAll({
      where: { tourism_id: tourismIds },
      attributes: ["tourism_id", "image_url"],
      raw: true,
    });

    const imageUrlsMap = imageUrls.reduce((map, image) => {
      if (!map[image.tourism_id]) {
        map[image.tourism_id] = [];
      }
      map[image.tourism_id].push({ image_url: image.image_url });
      return map;
    }, {});

    const resultTourism = recommendedIndexes.map((index) => {
      const tourismData = tourism[index];
      const imageUrls = imageUrlsMap[tourismData.id] || [];
      return { ...tourismData.dataValues, tourism_images: imageUrls };
    });

    const cleanedResult = resultTourism.map((data) => {
      const {
        uniqno,
        _previousDataValues,
        _changed,
        _options,
        isNewRecord,
        ...cleanedData
      } = data;
      return { ...cleanedData, image_url: data.image_url };
    });
    res.status(200).json(respone("Rekomendasi berhasil dimuat", cleanedResult));
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
  // Check if the user has already rated the tourism
  const existingRating = await users_rating.findOne({
    where: { user_id: user_id, tourism_id: tourism_id },
  });

  if (existingRating) {
    return res.status(400).json({
      error: true,
      msg: "Anda sudah memberikan rating untuk tempat wisata ini.",
    });
  }
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
