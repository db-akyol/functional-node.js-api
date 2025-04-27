var express = require("express");
var router = express.Router();
const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    let users = await Users.find({});
    return res.json(Response.succesResponse(users));
  } catch (error) {
    console.error("Kullanıcı çekme hatası:", error);
    return res.status(500).json({ error: "Kullanıcı çekilirken hata oluştu" });
  }
});

router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    // const { email, password, first_name, last_name, phone_number } = req.body;

    // email alanı dolu mu boş mu kontrolü
    if (!body.email) {
      return res.status(400).json({ error: "Email alanı boş bırakılamaz!" });
    }

    // email formatı doğru mu kontrolü
    if (is.not.email(body.email)) {
      return res.status(400).json({ error: "Email yanlış formatta girilmiş!" });
    }

    // şifre alanı dolu mu boş mu kontrolü
    if (!body.password) {
      return res.status(400).json({ error: "Şifre alanı boş bırakılamaz!" });
    }

    // şifre karakter uzunluk kontrolü
    if (body.password.length < 8) {
      return res.status(400).json({ error: "Şifre 8 haneden büyük olmalıdır :))" });
    }

    let user = await Users.create({
      email: body.email,
      password: body.password,
      is_active: true,
      customer_name: body.customer_name,
      phone_number: body.phone_number,
    });

    return res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse({ success: true }, Enum.HTTP_CODES.CREATED));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", async (req, res) => {
  let body = req.body;
  let updates = {};
  try {
    // id alanı kontrolü
    if (!body._id) {
      return res.status(400).json({ error: "Güncellenecek kullanıcının id'si şarttır" });
    }

    // email alanı dolu mu boş mu kontrolü
    if (!body.email) {
      return res.status(400).json({ error: "Email alanı boş bırakılamaz!" });
    }

    // email formatı doğru mu kontrolü
    if (is.not.email(body.email)) {
      return res.status(400).json({ error: "Email yanlış formatta girilmiş!" });
    }

    // şifre karakter uzunluk kontrolü
    if (body.password && body.password.length > 8) {
      updates.password = body.password;
    } else {
      return res.status(400).json({ error: "Şifre 8 haneden büyük olmalıdır :))" });
    }

    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    if (body.customer_name) updates.customer_name = body.customer_name;
    if (body.phone_number) updates.phone_number = body.phone_number;
    if (body.email) updates.email = body.email;

    await Users.updateOne({ _id: body._id }, updates);

    res.json(Response.succesResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    let body = req.body;

    // emaile göre silme işlemi
    // await Users.deleteOne({ email: body.email });

    // id'ye göre silme işlemi
    await Users.deleteOne({ _id: body._id });

    res.json(Response.succesResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});
module.exports = router;
