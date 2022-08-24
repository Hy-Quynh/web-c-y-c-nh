import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TopicIcon from "@mui/icons-material/Topic";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

export const USER_INFO_KEY = "user_info";
export const USER_CART_INFO = "user_prd_card";
export const API_SERVER_URL = "http://localhost:5004/api";
export const ADMIN_ROLE = [
  {
    label: "Dashboard",
    value: "admin-dashboard",
    href: "/admin",
    icon: <DashboardIcon />,
  },
  {
    label: "Danh mục",
    value: "admin-category",
    href: "/admin/category",
    icon: <TopicIcon />,
  },
  {
    label: "Sản phẩm",
    value: "admin-product",
    href: "/admin/product",
    icon: <StorefrontIcon />,
  },
  {
    label: "CT khuyến mãi",
    value: "admin-promo",
    href: "/admin/promo",
    icon: <CardGiftcardIcon />,
  },
  {
    label: "Đơn hàng",
    value: "admin-order",
    href: "/admin/order",
    icon: <ShoppingCartCheckoutIcon />,
  },
  {
    label: "Bài viết",
    value: "admin-blog",
    href: "/admin/post",
    icon: <PostAddIcon />,
  },
  {
    label: "Quyền",
    value: "admin-role",
    href: "/admin/role",
    icon: <ManageAccountsIcon />,
  },
  {
    label: "Tài khoản",
    value: "admin-account",
    href: "/admin/account",
    icon: <PeopleIcon />,
  },
];
export const FORMAT_NUMBER = new Intl.NumberFormat();
export const BLUR_BASE64 =
  "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
