import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  static async apiGetRestaurants(req, res, next) {
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }
    try {
      const { restaurantsList, totalNumRestaurants } =
        await RestaurantsDAO.getRestaurants({
          filters,
          page,
          restaurantsPerPage,
        });

      let response = {
        restaurants: restaurantsList,
        page: page,
        filters: filters,
        entries_per_page: restaurantsPerPage,
        total_results: totalNumRestaurants,
      };
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiGetRestaurantsById(req, res, next) {
    try {
      const restaurantId = req.params.id || {};
      const restaurantResponse = await RestaurantsDAO.getRestaurantsById(
        restaurantId
      );
      if (!restaurantResponse) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(restaurantResponse);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }
  static async apiGetCuisines(req, res, next) {
    try {
      const cuisines = await RestaurantsDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      console.error(`api , ${e}`);
      res.status(500).json({ error: e.message });
    }
  }
}
