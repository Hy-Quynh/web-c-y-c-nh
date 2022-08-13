import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import { Alert, Box, Drawer, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlaceholderImage from "../../../assets/user/placeholder-image.jpeg";
import { dateTimeConverter } from "../../../utils/common";
import { Markup } from "interweave";

const inputStyle = {
  width: "80%",
  height: "50px",
  border: "1px solid #1876D1",
  padding: "10px",
  borderRadius: "5px",
  marginLeft: "20px",
};

export default function ViewProductDrawer(props) {
  const { visible, initData, onClose } = props;
  return (
    <React.Fragment key="right">
      <Drawer anchor="right" open={visible} onClose={() => onClose()}>
        <Box sx={{ width: "50vw", minWidth: "300px", paddingTop: "80px" }}>
          <Stack justifyContent={"end"}>
            <Box>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
          <Box sx={{ padding: "20px" }}>
            <Box
              sx={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              THÔNG TIN SẢN PHẨM
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <img
                src={initData?.product_image || PlaceholderImage}
                alt="product-image"
                width={100}
                height={100}
              />
            </div>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box sx={{ width: "20%" }}>
                <div style={{ color: "#1876D1" }}>Tên sản phẩm:</div>
              </Box>
              <Box sx={inputStyle}>{initData?.product_name || ""}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box sx={{ width: "20%" }}>
                <div style={{ color: "#1876D1" }}>Danh mục:</div>
              </Box>
              <Box sx={inputStyle}>{initData?.category_name}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box sx={{ width: "20%" }}>
                <div style={{ color: "#1876D1" }}>Giá:</div>
              </Box>
              <Box sx={inputStyle}>{initData?.product_price}</Box>
            </Stack>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Box sx={{ width: "20%" }}>
                <div style={{ color: "#1876D1" }}>Ngày tạo:</div>
              </Box>
              <Box sx={inputStyle}>
                {dateTimeConverter(initData?.create_at)}
              </Box>
            </Stack>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="flex-start"
              justifyContent="flex-start"
              style={{ marginTop: "20px" }}
            >
              <Box sx={{ width: "20%" }}>
                <div style={{ color: "#1876D1" }}>Mô tả:</div>
              </Box>
              <Box
                sx={{
                  width: "80%",
                  border: "1px solid #1876D1",
                  padding: "10px",
                  borderRadius: "5px",
                  marginLeft: "20px",
                  overflowX: 'auto'
                }}
              >
                <Markup content={initData?.product_description} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
