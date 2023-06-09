const { default: axios } = require("axios");
const { Tourism, Categories, Category, users_rating } = require("../../models");
const { respone } = require("../../utils/response");
const fs = require("fs");
const sequelize = require("sequelize");

async function getAllTourismHandler(req, res, next) {
  try {
    const tourisms = await Tourism.findAll();
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
      include: Categories,
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

    const rating = req.body.rating;

    const body = {
      user_feature: [rating],
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

async function giveRatingTourism(req, res) {
  const { user_id, tourism_id, rating } = req.body;
  const categoriesData = [
    { id: 1, name: "Budaya" },
    { id: 2, name: "Cagar Alam" },
    { id: 3, name: "Bahari" },
  ];
  try {
    const ratings = await users_rating.create({
      user_id: user_id,
      tourism_id: tourism_id,
      rating: rating,
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

      console.log("HASIL AVERAGE NYA : ", averageRating);
      console.log("CATEGORY ID NYA : ", categoryId);

      await Category.update(
        { average_rating: averageRating },
        { where: { id: categoryId } }
      );
    }

    res.status(201).json(respone("Berhasil menambahkan ratings", ratings));
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
  giveRatingTourism,
};
