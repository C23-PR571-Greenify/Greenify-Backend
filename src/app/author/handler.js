const { author } = require("../../models");
const { respone, errorRespone } = require("../../utils/response");

async function getAllAuthorHandler(req, res, next) {
  try {
    const Authors = await author.findAll({
      attributes: [
        "id",
        "fullname",
        "bangkit_id",
        "path",
        "linkedIn",
        "github",
        "profile_url",
      ],
    });
    if (!Authors)
      return res.status(404).json(errorRespone("Authors not found"));
    res.status(200).json(respone("Success get all authors", Authors));
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllAuthorHandler };
