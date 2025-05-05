var express = require("express");
var router = express.Router();
const Service = require("../db/models/Service");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const authMiddleware = require("../middleware/auth");

/* GET services listing. */
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    let services = await Service.find({});
    return res.json(Response.succesResponse(services));
  } catch (error) {
    console.error("Kullanıcı çekme hatası:", error);
    return res.status(500).json({ error: "Kullanıcı çekilirken hata oluştu" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  let body = req.body;
  try {
    // const { email, password, first_name, last_name, phone_number } = req.body;

    // name alanı dolu mu boş mu kontrolü
    if (!body.name) {
      return res.status(400).json({ error: "Email alanı boş bırakılamaz!" });
    }

    // fiyat alanı dolu mu boş mu kontrolü
    if (!body.price) {
      return res.status(400).json({ error: "Şifre alanı boş bırakılamaz!" });
    }

    // süre alanı dolu mu boş mu kontrolü
    if (!body.duration) {
      return res.status(400).json({ error: "Şifre alanı boş bırakılamaz!" });
    }

    let service = await Service.create({
      name: body.name,
      price: body.price,
      duration: body.duration,
      description: body.description,
    });

    return res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse({ success: true }, Enum.HTTP_CODES.CREATED));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  let body = req.body;
  let updates = {};
  try {
    // id alanı kontrolü
    if (!body._id) {
      return res.status(400).json({ error: "Güncellenecek kullanıcının id'si şarttır" });
    }

    // price alanı kontrolü
    if (!body.price) {
      return res.status(400).json({ error: "Güncellenecek kullanıcının id'si şarttır" });
    } else {
      updates.price = body.price;
    }

    await Service.updateOne({ _id: body._id }, updates);

    res.json(Response.succesResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    let body = req.body;

    // emaile göre silme işlemi
    // await Users.deleteOne({ email: body.email });

    // id'ye göre silme işlemi
    await Service.deleteOne({ _id: body._id });

    res.json(Response.succesResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
