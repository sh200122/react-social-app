import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("令牌失效!");

    const q = `
      SELECT p.*, u.name, u.profilePic 
      FROM posts AS p 
      JOIN users AS u ON u.id = p.userId
      LEFT JOIN relationship AS r ON p.userId = r.followedUserId
      WHERE r.followerUserId = ?
      ORDER BY p.createdAt DESC
      LIMIT 5
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
