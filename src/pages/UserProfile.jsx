import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context";
import api from "../api";
import { Box, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const UserProfile = () => {
  const [userInfomations, setUserInformations] = useState(null);
  const [userNotes, setUserNotes] = useState(null);

  const appContext = useContext(AppContext);
  const { user } = appContext;
  const CurrentDateTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState("");

    useEffect(() => {
      const now = new Date();
      const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
      const day = now.toLocaleString("en-US", { day: "2-digit" });
      const month = now.toLocaleString("en-US", { month: "long" });
      const year = now.getFullYear();

      setCurrentDateTime(`${dayOfWeek}, ${day} ${month} ${year}`);
    }, []);

    return <div className="font-normal text-xl">{currentDateTime}</div>;
  };
  useEffect(() => {
    let ignore = false;
    const getUserInformation = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${user.id}`
          // `https://samnote.mangasocial.online/folder/77`
        );
        if (!ignore) {
          setUserInformations(res.data.user);
          setUserNotes(res.data.note);
          console.log(res.data.note);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserInformation();

    return () => {
      ignore = true;
    };
  }, []);
  return (
    <Box className="bg-zinc-100 w-full">
      {userInfomations && (
        <>
          <Box className=" relative">
            <img
              src={userInfomations.Avarta}
              alt=""
              className="w-full h-[500px]"
            />

            <Typography
              variant="h4"
              className="inline-block text-white font-medium absolute right-10 top-10 p-7 rounded-lg"
            >
              Hello {userInfomations.name} !
              <CurrentDateTime />
            </Typography>
          </Box>
          <Box className="flex items-center gap-8 w-10/12 mx-auto my-3 ">
            <img
              src={userInfomations.AvtProfile}
              alt=""
              className="w-28 rounded-full"
            />
            <Box>
              <Typography variant="h5" className="uppercase font-bold">
                {userInfomations.name}
              </Typography>
              <Typography className="text-xl">
                {userInfomations.gmail}
              </Typography>
            </Box>
          </Box>
          <Box className="flex gap-10 px-10">
            <Box className="flex-[2]">
              {userNotes.length > 0 ? (
                <>note....</>
              ) : (
                <Box className="bg-white p-4 rounded-lg">
                  <Typography
                    variant="h5"
                    className="font-semibold text-center"
                  >
                    No note to show
                  </Typography>
                </Box>
              )}
            </Box>
            <Box className="flex-1 bg-[#FFF4BA] p-4 rounded-lg">
              <Box className="flex justify-between ">
                <Typography
                  variant="h5"
                  className="font-semibold text-zinc-400"
                >
                  Scratch Path
                </Typography>
                <MoreHorizIcon />
              </Box>
              <Typography>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint,
                sequi? Corporis, eum enim? Quod in est quae necessitatibus vero,
                temporibus incidunt, fugit aliquid, deleniti provident officia
                cumque itaque asperiores neque.
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserProfile;
