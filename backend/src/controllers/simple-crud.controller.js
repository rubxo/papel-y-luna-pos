function createCrudController(Model, entityName, defaultOrder = [["createdAt", "DESC"]]) {
  return {
    async list(_req, res, next) {
      try {
        const data = await Model.findAll({ order: defaultOrder });
        res.json({ success: true, data });
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        const data = await Model.create(req.body);
        res.status(201).json({ success: true, data });
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        const data = await Model.findByPk(req.params.id);
        if (!data) {
          const error = new Error(`${entityName} no encontrado`);
          error.status = 404;
          throw error;
        }
        await data.update(req.body);
        res.json({ success: true, data });
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const data = await Model.findByPk(req.params.id);
        if (!data) {
          const error = new Error(`${entityName} no encontrado`);
          error.status = 404;
          throw error;
        }
        if ("active" in data) await data.update({ active: false });
        else await data.destroy();
        res.json({ success: true, data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = createCrudController;
