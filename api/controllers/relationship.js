import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getRelationships = (req, res) => {
  const q = `select followerUserId from relationship where followedUserId=?`;

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) {
      console.error("SQL 查询错误: ", err);
      return res.status(500).json("服务器内部错误");
    }
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("令牌无效！");

    const q =
      "INSERT INTO relationship (followerUserId,followedUserId) VALUES (?,?)";

    const values = [userInfo.id, req.body.userId];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("SQL 查询错误: ", err);
        return res.status(500).json("服务器内部错误");
      }
      return res.status(200).json("关注");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("令牌无效！");

    const q =
      "delete from relationship where followerUserId=? and followedUserId=?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) {
        console.error("SQL 查询错误: ", err);
        return res.status(500).json("服务器内部错误");
      }
      return res.status(200).json("取消关注");
    });
  });
};
