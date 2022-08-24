const asyncHandler = require("express-async-handler");
const asyncBusboy = require("async-busboy");
const bcrypt = require("bcrypt");
const { getAllRole, createRoleData, deleteRoleData, updateRoleData, getRoleFunctionByName, getRoleByAdminId } = require("../models/role");

module.exports = {
  getAllRole: asyncHandler(async (req, res) => {
    const {search, limit, offset} = req.query
    const results = await getAllRole(search, limit, offset)
    res.send({success: true, payload: results})
  }),

  createNewRole: asyncHandler(async (req, res) => {
    const { name, role_function } = req.body
    const results = await createRoleData(name, role_function)
    res.send({success: results})
  }),

  deleteRole: asyncHandler(async (req, res) => {
    const {roleId} = req.params
    const results = await deleteRoleData(roleId)
    res.send({success: results})
  }),

  updateRole: asyncHandler(async (req, res) => {
    const {roleId} = req.params
    const { name, role_function } = req.body
    const results = await updateRoleData(name, role_function, roleId)
    res.send({success: results})
  }),

  getRoleFunctionByName: asyncHandler(async (req, res) => {
    const {roleName} = req.params
    const results = await getRoleFunctionByName(roleName)
    res.send({success: true, payload: results})
  }),

  getRoleByAdminId: asyncHandler(async (req, res) => {
    const {adminId} = req.params
    const results = await getRoleByAdminId(adminId)
    res.send({success: true, payload: results})
  }),
}