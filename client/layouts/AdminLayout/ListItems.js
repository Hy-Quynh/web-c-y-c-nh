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
import { USER_INFO_KEY } from "../../utils/constants";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

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
      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin",
          });
        }}
        sx={{ background: router?.pathname === "/admin" ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/category",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/category") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <TopicIcon />
        </ListItemIcon>
        <ListItemText primary="Danh mục" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/product",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/product") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <QuestionAnswerIcon />
        </ListItemIcon>
        <ListItemText primary="Sản phẩm" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/promo",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/promo") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <CardGiftcardIcon />
        </ListItemIcon>
        <ListItemText primary="CT khuyến mãi" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/order",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/order") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <ShoppingCartCheckoutIcon />
        </ListItemIcon>
        <ListItemText primary="Đơn hàng" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/post",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/post") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <PostAddIcon />
        </ListItemIcon>
        <ListItemText primary="Bài viết" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/role",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/role") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText primary="Quyền" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push({
            pathname: "/admin/account",
          });
        }}
        sx={{
          background: router?.pathname?.includes("/account") ? "#e8e2e1" : "",
        }}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Tài khoản" />
      </ListItemButton>
    </React.Fragment>
  );
}
