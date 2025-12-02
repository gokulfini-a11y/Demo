const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/items", async (req, res) => {
  try {
    const url = "https://linette-remiss-manly.ngrok-free.dev/mesmw/api/v3/DirectAccess?spName=sp_Custom_Item_Inventory_JSON&spParams={\"PageNumber\":1,\"PageSize\":10,\"entName\":null,\"itemId\":null,\"description\":null,\"lot_no\":null,\"sublot_no\":null,\"item_grade_desc\":null,\"item_state_desc\":null,\"item_class\":null,\"fromExpiryDate\":null,\"toExpiryDate\":null,\"siteId\":null,\"site_name\":null,\"sortBy\":\"row_id\",\"sortDir\":\"desc\"}";

    const token = "abc"; // replace dynamically later

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // response.data looks like: [ { data: "string json" } ]
    const rawString = response.data[0].data;
    const parsed = JSON.parse(rawString);

    return res.json({
      data: parsed.data,
      metaData: parsed.metaData
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/", (req, res) => {
  res.send("API Running successfully 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
