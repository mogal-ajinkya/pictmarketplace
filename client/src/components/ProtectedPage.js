import { message, Badge, Avatar } from "antd";
import React from "react";
import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { SetLoader } from "../redux/loadersSlice";

import Notifications from "./Notifications";
import { GetAllNotifications , ReadAllNotifications } from "../apicalls/notifications";
import { GetCurrentUser } from "../apicalls/users";

function ProtectedPage({ children }) {

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));

      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      message.error(error.message);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications();

      if (response.success) {
        setNotifications(response.data);
        // console.log(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  
  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      navigate("/login");
      // message.error("Please login to access this page");
    }
  }, []);


  return (
    user && (
      <div>
        {/* header  */}
        <div className="flex justify-between items-center bg-primary p-5 w-full ">
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            PICT OLX
          </h1>


          <div className="bg-white py-2 px-5 rounded flex gap-2 items-center">
            <span
              className="cursor-pointer uppercase"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              <div className="max-sm:hidden underline ">
              {user.name}
              </div>
              <div className="sm:hidden">
              <i class="ri-account-circle-line font-size-[34px]"></i>
                
              </div>
            </span>

            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={<i className="ri-notification-3-line"></i>}
              />
            </Badge>

            <i
              className ="ri-logout-box-r-line"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>



        </div>
        {/* body */}



        <div className="p-5">{children}</div>

        {
          <Notifications
            notifications={notifications}
            reloadNotifications={getNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
    )
  );
}

export default ProtectedPage;
