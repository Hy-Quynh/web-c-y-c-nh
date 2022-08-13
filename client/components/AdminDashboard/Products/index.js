import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { dateTimeConverter } from "../../../utils/common";

const QUESTION_IN_PAGE = 10;

export default function AdminDashboardProduct() {
  return (
    <div>
      <p style={{fontSize: '16px', fontWeight: 600}}>Sản phẩm mới nhất</p>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell align="center">Tên sản phẩm</TableCell>
              <TableCell align="center">Giá</TableCell>
              <TableCell align="center">Lượt xem</TableCell>
              <TableCell align="center">Lượt mua</TableCell>
              <TableCell align="center">Ngày đăng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[]?.map((row, index) => (
              <TableRow
                key={`dashboard-question-${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  {row?.actor_firstname + " " + row?.actor_lastname}
                </TableCell>
                <TableCell align="center">{row?.question_title}</TableCell>
                <TableCell align="center">
                  {dateTimeConverter(row?.created_day)}
                </TableCell>
                <TableCell align="center">{row?.question_view}</TableCell>
                <TableCell align="center">{row?.count_answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
