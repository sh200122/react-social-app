import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("用户已经存在!");
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("新用户已经创建.");
    });
  });
};

export const login = (req, res) => {
  const q = "select * from users where username=?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(404).json("没找到该用户");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) return res.status(400).json("用户名或密码错误");

    const token = jwt.sign({ id: data[0].id }, "secretkey", {
      expiresIn: "10h",
    });

    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("用户已退出登录");
};
