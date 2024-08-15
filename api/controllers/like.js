import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getLikes = (req, res) => {
  const q = "select userId from likes where postId=?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) {
      console.error("SQL 查询错误: ", err);
      return res.status(500).json("服务器内部错误");
    }
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("令牌无效！");

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?,?)";

    const values = [userInfo.id, req.body.postId];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("SQL 查询错误: ", err);
        return res.status(500).json("服务器内部错误");
      }
      return res.status(200).json("喜欢该帖子");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("令牌无效！");

    const q = "delete from likes where userId=? and postId=?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) {
        return res.status(500).json("服务器内部错误");
      }
      return res.status(200).json("不喜欢该帖子");
    });
  });
};
