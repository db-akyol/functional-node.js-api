var express = require("express");
var router = express.Router();
const Appoinstments = require("../db/models/Appoinstments");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    let appoinstments = await Appoinstments.find({});
    return res.json(Response.succesResponse(appoinstments));
  } catch (error) {
    console.error("Randevu çekme hatası:", error);
    return res.status(500).json({ error: "Randevular çekilirken hata oluştu" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  let body = req.body;
  try {
    if (!body.customer_name) {
      return res.status(400).json({ error: "Name alanı boş bırakılamaz!" });
    }

    if (!body.phone_number) {
      return res.status(400).json({ error: "Telefon numarası alanı boş bırakılamaz!" });
    }

    if (!body.service) {
      return res.status(400).json({ error: "Hizmet alanı boş bırakılamaz!" });
    }

    if (!body.date) {
      return res.status(400).json({ error: "Tarih alanı boş bırakılamaz!" });
    }

    let appoinstments = await Appoinstments.create({
      customer_name: body.customer_name,
      phone_number: body.phone_number,
      service: body.service,
      date: body.date,
      notes: body.notes,
      is_approved: body.is_approved,
    });

    return res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse({ success: true }, Enum.HTTP_CODES.CREATED));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
