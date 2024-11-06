import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/Authentication";
import axios from "axios";
import Loader from "../../../components/Loader";
import defaultUserProfile from "../../../img/default-user.jpg";
import { formatDistanceToNowStrict } from "date-fns";

const Notification = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response notification: ", response.data);

        setNotifications(response.data);
      } catch (error) {
        console.log("error occurred while fetching notifications: ", error);
      } finally {
        setLoading(false);
      }
    };

    const handleMarkAllAsRead = async () => {
      try {
        await axios.put(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/mark-all-notifications-as-read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    handleMarkAllAsRead();
    fetchAllNotifications();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="px-24 max-lg:px-5">
      <div className="py-4 z-10 text-sm my-8 w-full bg-white border border-gray-200 rounded-md">
        <div className="flex justify-between items-center  px-3">
          <h3 className="text-xl font-semibold text-gray-700">Notifications</h3>
        </div>
        <hr className="mt-3" />
        <ul>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification._id}
                className="px-4 py-2 flex gap-2 w-full border-b border-gray-200 hover:bg-gray-100"
              >
                <figure className="w-10 h-10">
                  <img
                    src={notification?.userId?.profileImg || defaultUserProfile}
                    alt={notification?.userId?.name || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </figure>
                <div className="w-full flex justify-between gap-2 max-sm:flex-col">
                  {notification.type === "comment" ? (
                    <div className="space-y-2 w-fit">
                      <p className="text-[13px]">
                        <span className="font-semibold">
                          {notification?.userId?.name}
                        </span>{" "}
                        commented on your post{" "}
                        <span className="font-semibold">
                          {notification?.post?.title?.length > 20
                            ? notification?.post?.title.slice(0, 20) + "..."
                            : notification?.post?.title}
                        </span>
                      </p>
                      <div className="border border-gray-200 rounded-md">
                        <p className="text-xs text-gray-700 font-medium p-3">
                          {notification?.comment?.content}
                        </p>
                        <hr />
                        <div className="flex gap-2  p-3 w-fit">
                          <figure className="w-20 h-full">
                            <img
                              src={notification?.post?.coverImage}
                              alt={notification?.post?.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </figure>
                          <div>
                            <h4 className="text-sm font-medium">
                              {notification?.post?.title}
                            </h4>
                            <p className="text-xs text-gray-600 ">
                              {notification?.post?.content?.length > 50
                                ? notification?.post?.content.slice(0, 50) +
                                  "..."
                                : notification?.post?.content}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {notification?.post?.likes?.length} likes
                      </span>
                    </div>
                  ) : notification.type === "like" ? (
                    <div className="space-y-2">
                      <p className="text-[13px]">
                        <span className="font-semibold">
                          {notification?.userId?.name}
                        </span>{" "}
                        liked your post{" "}
                        <span className="font-semibold">
                          {notification?.post?.title?.length > 20
                            ? notification?.post?.title.slice(0, 20) + "..."
                            : notification?.post?.title}
                        </span>
                      </p>
                      <div className="flex gap-2 border border-gray-200 rounded-md p-3 w-fit">
                        <figure className="w-20 h-full">
                          <img
                            src={notification?.post?.coverImage}
                            alt={notification?.post?.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </figure>
                        <div>
                          <h4 className="text-sm font-medium">
                            {notification?.post?.title}
                          </h4>
                          <p className="text-xs text-gray-600 ">
                            {notification?.post?.content?.length > 50
                              ? notification?.post?.content.slice(0, 50) + "..."
                              : notification?.post?.content}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {notification?.post?.likes?.length} likes
                      </span>
                    </div>
                  ) : notification.type === "follow" ? (
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification?.userId?.name}
                      </span>{" "}
                      started following you
                    </p>
                  ) : notification.type === "save" ? (
                    <div className="space-y-2">
                      <p className="text-[13px]">
                        <span className="font-semibold">
                          {notification?.userId?.name}
                        </span>{" "}
                        saved your post{" "}
                        <span className="font-semibold">
                          {notification?.post?.title?.length > 20
                            ? notification?.post?.title.slice(0, 20) + "..."
                            : notification?.post?.title}
                        </span>
                      </p>
                      <div className="flex gap-2 border border-gray-200 rounded-md p-3 w-fit">
                        <figure className="w-20 h-full">
                          <img
                            src={notification?.post?.coverImage}
                            alt={notification?.post?.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </figure>
                        <div>
                          <h4 className="text-sm font-medium">
                            {notification?.post?.title}
                          </h4>
                          <p className="text-xs text-gray-600 ">
                            {notification?.post?.content?.length > 50
                              ? notification?.post?.content.slice(0, 50) + "..."
                              : notification?.post?.content}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {notification?.post?.likes?.length} likes
                      </span>
                    </div>
                  ) : null}
                  <span className="text-xs max-sm:self-end">
                    {formatDistanceToNowStrict(
                      new Date(notification?.createdAt),
                      {
                        addSuffix: true,
                      }
                    )
                      .replace(" seconds", " sec")
                      .replace(" second", " sec")
                      .replace(" minutes", " min")
                      .replace(" minute", " min")
                      .replace(" hours", " hr")
                      .replace(" hour", " hr")}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center mt-3 text-gray-600">No Notifications</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Notification;
