const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/items", async (req, res) => {
  try {
    const url = "https://linette-remiss-manly.ngrok-free.dev/mesmw/api/v3/DirectAccess?spName=sp_Custom_Item_Inventory_JSON&spParams={\"PageNumber\":1,\"PageSize\":10,\"entName\":null,\"itemId\":null,\"description\":null,\"lot_no\":null,\"sublot_no\":null,\"item_grade_desc\":null,\"item_state_desc\":null,\"item_class\":null,\"fromExpiryDate\":null,\"toExpiryDate\":null,\"siteId\":null,\"site_name\":null,\"sortBy\":\"row_id\",\"sortDir\":\"desc\"}";

    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ0QTc0RkQ2REY5MkI0NUU4RjE3Nzk2NEREMEY5MzUxNTQ5NjhBQ0FSUzI1NiIsIng1dCI6IlJLZFAxdC1TdEY2UEYzbGszUS1UVVZTV2lzbyIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovL21lczQubWVzLmxvY2FsL2lkZW50aXR5bWFuYWdlciIsIm5iZiI6MTc2NDY0Njk2NSwiaWF0IjoxNzY0NjQ2OTY1LCJleHAiOjE3NjQ2NTA1NjUsImF1ZCI6InN5c3RlbSIsInNjb3BlIjpbInN5c3RlbSJdLCJhbXIiOlsicGFzc3dvcmQiXSwiY2xpZW50X2lkIjoiQUlNX0RlZmF1bHRNYW5hZ2VtZW50Q2xpZW50Iiwic3ViIjoibWVzXFxmc2VydmljZSIsImF1dGhfdGltZSI6MTc2NDY0Njk2NSwiaWRwIjoiV2luZG93cyIsImh0dHBzOi8vYWltLmNvbm5lY3QuYXZldmEuY29tL2NsYWltcy9mZWRlcmF0ZWRfaWRwIjoiV2luZG93cyIsInByZWZlcnJlZF91c2VybmFtZSI6Im1lc1xcZnNlcnZpY2UiLCJuYW1lIjoiZnNlcnZpY2UiLCJpZCI6IlMtMS01LTIxLTc5NjIwNjAwNS0xMzg0NjMzODY2LTUzMzcyNTQ3MS0xNjA5Iiwicm9sZSI6WyJpZGVudGl0eW1hbmFnZXIuYWRtaW4iLCJTLTEtNS0yMS03OTYyMDYwMDUtMTM4NDYzMzg2Ni01MzM3MjU0NzEtNTEzIiwiUy0xLTEtMCIsIlMtMS01LTIxLTQxMDgwMjU4NzMtMjMzMjAyNjYzNS0yMjAwMjcxODUxLTEwMDciLCJTLTEtNS0zMi01NDUiLCJTLTEtNS0zMi01NDQiLCJTLTEtNS0yIiwiUy0xLTUtMTEiLCJTLTEtNS0xNSIsIlMtMS01LTIxLTc5NjIwNjAwNS0xMzg0NjMzODY2LTUzMzcyNTQ3MS01MTIiLCJTLTEtMTgtMiIsIlMtMS01LTIxLTc5NjIwNjAwNS0xMzg0NjMzODY2LTUzMzcyNTQ3MS01NzIiXX0.aSh_YI7iUlqlyUTBhdr0VR9mHCLWlX-BI0lCXZIbkFAiB8U3DUWY0YKKNZVShzNHxVczMpgfrLNjM4gD6TQ54-bFouK9xMekmhaNCfQzvFl7LmiFvU74psRoXwivHMVDuXkvRVww0K_jSaT-Vxq-ZhRlQLzqU_r5U4Wc75HXkEGN2ApR7kzZNx9wGhz7aoaLjt_NrNAGRu221daVX_lgvd6QUJbu1GBlpo6bgKPENz9fJM4aZOhX-JhJGcaVZ4gYRu1vYqCwuqZwb2KlU1tHcO__WYHAQuAfw7ETSKx7YzGUaCZAe52D8z2jUodB5GJAS4W9ykqT9bbTZfFDvjPi8Q"; // replace dynamically later

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
