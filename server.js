const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Sample MES items data
const items = [
  { id: "RM001", name: "Raw Milk", type: "Raw Material", uom: "Litre", status: "Available" },
  { id: "RM002", name: "Cream", type: "Raw Material", uom: "Kg", status: "Available" },
  { id: "SF001", name: "Cheese Curd", type: "Semi Finished", uom: "Kg", status: "In Process" },
  { id: "FN001", name: "Butter", type: "Finished", uom: "Kg", status: "Ready" },
  { id: "FN002", name: "Cheddar Cheese", type: "Finished", uom: "Kg", status: "Ready" }
];

// GET endpoint
app.get("/items", (req, res) => {
  res.json(items);
});

// Default route
app.get("/", (req, res) => {
  res.send("MES Test API running successfully 🚀");
});

// Port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
