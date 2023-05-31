const { Category } = require("../../models");

async function getAllCategoriesHandler(req, res, next) {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  const { name, desc } = req.body;
  try {
    const categories = await Category.create({ name, description: desc });
    res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  const { id } = req.params;
  try {
    const categories = await Category.destroy({
      where: {
        id,
      },
    });
    if (!categories) {
      return res
        .status(404)
        .json({ msg: `Category with id : ${id} not found` });
    }
    res.status(200).json({ msg: `Category with id : ${id} has beed deleted` });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  const { id } = req.params;
  const { name, desc } = req.body;

  try {
    await Category.update(
      {
        name: name,
        description: desc,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({ msg: `Category with id : ${id} updated` });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategoriesHandler,
  createCategory,
  deleteCategory,
  updateCategory,
};
