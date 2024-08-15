import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import "moment/locale/zh-cn";
import { Link } from "react-router-dom";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  moment.locale("zh-cn");

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => {
        return res.data;
      }),
  });

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="stories">
      {error
        ? "发生了一些错误"
        : isLoading
        ? "加载中..."
        : data.map((story) => (
            <Link
              to={`/profile/${story.userId}`}
              key={story.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="story">
                <img src={"/upload/" + story.img} alt="" />
                <div className="story-details">
                  <img
                    className="avatar"
                    src={"/upload/" + story.profilePic}
                    alt=""
                  />
                  <div>
                    <span className="name">{story.name}</span>
                    <span className="date">
                      {moment(story.createdAt).fromNow()}
                    </span>{" "}
                  </div>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default Stories;
