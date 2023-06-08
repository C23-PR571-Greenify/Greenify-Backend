const fs = require("fs");
const csvParser = require("csv-parser");

const categories = [
  {
    name: "Budaya",
    description:
      "Warisan dan praktik yang diwariskan dari generasi ke generasi.",
  },
  {
    name: "Cagar Alam",
    description:
      "Area alami yang dilindungi untuk melestarikan keanekaragaman hayati dan ekosistem.",
  },
  {
    name: "Bahari",
    description:
      "Segala sesuatu yang terkait dengan laut dan kehidupan di dalamnya.",
  },
];

const results = [];
fs.createReadStream("./seeders/tourism.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    const category =
      categories.findIndex((category) => category.name === data.Category) + 1;

    if (category === 0) {
      return;
    }
    results.push({
      place_name: data.Place_Name,
      description: data.Description,
      category_id: category,
      city: data.City,
      price: data.Price,
      rating: data.Rating,
      lat: data.Lat,
      lng: data.Long,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  })
  .on("end", () => {
    fs.writeFileSync(
      "./seeders/tourism.json",
      JSON.stringify(results, null, 2)
    );
  });
