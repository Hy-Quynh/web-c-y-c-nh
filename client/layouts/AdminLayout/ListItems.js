import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TopicIcon from "@mui/icons-material/Topic";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useRouter } from "next/router";
import { getRoleByAdminId } from "../../services/role";
import { parseJSON } from "../../utils/common";
import { ADMIN_ROLE, USER_INFO_KEY } from "../../utils/constants";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

export default function MainListItems() {
  const [userRole, setUserRole] = React.useState([]);
  const router = useRouter();

  const userInfo =
    typeof window !== "undefined"
      ? parseJSON(localStorage.getItem(USER_INFO_KEY))
      : {};

  const getUserRole = async () => {
    if (userInfo?.admin_id) {
      const role = await getRoleByAdminId(userInfo?.admin_id);
      if (role?.data?.success) {
        setUserRole(role?.data?.payload?.role_function?.split(","));
      }
    }
  };

  React.useEffect(() => {
    getUserRole();
  }, []);

  return (
    <React.Fragment>
      {userRole?.map((roleItem, roleIndex) => {
        const roleInfo = ADMIN_ROLE?.find((item) => item?.value === roleItem);
        return (
          <ListItemButton
            key={`role-item-${roleIndex}`}
            onClick={() => {
              router.push({
                pathname: roleInfo?.href,
              });
            }}
            sx={{
              background: router?.pathname === roleInfo?.href ? "#e8e2e1" : "",
            }}
          >
            <ListItemIcon>{roleInfo?.icon}</ListItemIcon>
            <ListItemText primary={roleInfo?.label} />
          </ListItemButton>
        );
      })}
    </React.Fragment>
  );
}
