const express = require("express");
const router = express.Router();
const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const { generateToken, generateRefreshToken } = require("../config/jwt");
const is = require("is_js");

// Kayıt ol
router.post("/register", async (req, res) => {
  try {
    const { email, password, customer_name, phone_number } = req.body;

    if (!email || !password || !customer_name) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Email, şifre ve müşteri adı zorunludur",
          code: 400,
        })
      );
    }

    if (is.not.email(email)) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Geçersiz email formatı",
          code: 400,
        })
      );
    }

    if (password.length < 8) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Şifre en az 8 karakter olmalıdır",
          code: 400,
        })
      );
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Bu email adresi zaten kullanımda",
          code: 400,
        })
      );
    }

    const user = await Users.create({
      email,
      password,
      customer_name,
      phone_number,
    });

    const token = generateToken({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id });

    user.refresh_token = refreshToken;
    await user.save();

    res.status(201).json(
      Response.succesResponse({
        token,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          customer_name: user.customer_name,
          phone_number: user.phone_number,
        },
      })
    );
  } catch (error) {
    res.status(500).json(Response.errorResponse(error));
  }
});

// Giriş yap
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Email ve şifre zorunludur",
          code: 400,
        })
      );
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json(
        Response.errorResponse({
          message: "Geçersiz email veya şifre",
          code: 401,
        })
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(
        Response.errorResponse({
          message: "Geçersiz email veya şifre",
          code: 401,
        })
      );
    }

    const token = generateToken({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id });

    user.refresh_token = refreshToken;
    await user.save();

    res.json(
      Response.succesResponse({
        token,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          customer_name: user.customer_name,
          phone_number: user.phone_number,
        },
      })
    );
  } catch (error) {
    res.status(500).json(Response.errorResponse(error));
  }
});

// Token yenileme
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Refresh token zorunludur",
          code: 400,
        })
      );
    }

    const user = await Users.findOne({ refresh_token: refreshToken });
    if (!user) {
      return res.status(401).json(
        Response.errorResponse({
          message: "Geçersiz refresh token",
          code: 401,
        })
      );
    }

    const token = generateToken({ userId: user._id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    user.refresh_token = newRefreshToken;
    await user.save();

    res.json(
      Response.succesResponse({
        token,
        refreshToken: newRefreshToken,
      })
    );
  } catch (error) {
    res.status(500).json(Response.errorResponse(error));
  }
});

// Çıkış yap
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(
        Response.errorResponse({
          message: "Refresh token zorunludur",
          code: 400,
        })
      );
    }

    const user = await Users.findOne({ refresh_token: refreshToken });
    if (user) {
      user.refresh_token = null;
      await user.save();
    }

    res.json(Response.succesResponse({ message: "Başarıyla çıkış yapıldı" }));
  } catch (error) {
    res.status(500).json(Response.errorResponse(error));
  }
});

module.exports = router;
