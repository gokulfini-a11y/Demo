const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/items", async (req, res) => {
  try {
    const url = `https://linette-remiss-manly.ngrok-free.dev/mesmw/api/v3/DirectAccess?spName=sp_Custom_Item_Inventory_JSON&spParams={\"PageNumber\":1,\"PageSize\":10,\"entName\":null,\"itemId\":null,\"description\":null,\"lot_no\":null,\"sublot_no\":null,\"item_grade_desc\":null,\"item_state_desc\":null,\"item_class\":null,\"fromExpiryDate\":null,\"toExpiryDate\":null,\"siteId\":null,\"site_name\":null,\"sortBy\":\"row_id\",\"sortDir\":\"desc\"}`;

    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ0QTc0RkQ2REY5MkI0NUU4RjE3Nzk2NEREMEY5MzUxNTQ5NjhBQ0FSUzI1NiIsIng1dCI6IlJLZFAxdC1TdEY2UEYzbGszUS1UVVZTV2lzbyIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovL21lczQubWVzLmxvY2FsL2lkZW50aXR5bWFuYWdlciIsIm5iZiI6MTc2NDY0NzM2OCwiaWF0IjoxNzY0NjQ3MzY4LCJleHAiOjE3NjQ2NTA5NjgsImF1ZCI6InN5c3RlbSIsInNjb3BlIjpbInN5c3RlbSJdLCJhbXIiOlsicGFzc3dvcmQiXSwiY2xpZW50X2lkIjoiQUlNX0RlZmF1bHRNYW5hZ2VtZW50Q2xpZW50Iiwic3ViIjoibWVzXFxmc2VydmljZSIsImF1dGhfdGltZSI6MTc2NDY0NzM2OCwiaWRwIjoiV2luZG93cyIsImh0dHBzOi8vYWltLmNvbm5lY3QuYXZldmEuY29tL2NsYWltcy9mZWRlcmF0ZWRfaWRwIjoiV2luZG93cyIsInByZWZlcnJlZF91c2VybmFtZSI6Im1lc1xcZnNlcnZpY2UiLCJuYW1lIjoiZnNlcnZpY2UiLCJpZCI6IlMtMS01LTIxLTc5NjIwNjAwNS0xMzg0NjMzODY2LTUzMzcyNTQ3MS0xNjA5Iiwicm9sZSI6WyJpZGVudGl0eW1hbmFnZXIuYWRtaW4iLCJTLTEtNS0yMS03OTYyMDYwMDUtMTM4NDYzMzg2Ni01MzM3MjU0NzEtNTEzIiwiUy0xLTEtMCIsIlMtMS01LTIxLTQxMDgwMjU4NzMtMjMzMjAyNjYzNS0yMjAwMjcxODUxLTEwMDciLCJTLTEtNS0zMi01NDUiLCJTLTEtNS0zMi01NDQiLCJTLTEtNS0yIiwiUy0xLTUtMTEiLCJTLTEtNS0xNSIsIlMtMS01LTIxLTc5NjIwNjAwNS0xMzg0NjMzODY2LTUzMzcyNTQ3MS01MTIiLCJTLTEtMTgtMiIsIlMtMS01LTIxLTc5NjIwNjAwNS0xMzg0NjMzODY2LTUzMzcyNTQ3MS01NzIiXX0.KUM5hp05Nf5kAbHNGgEjH_TculMGt9CK2NQ91hhLWX4GWUQqtwj0x6wjGgJpXqLAapl2RTiHAeF2YjNYHzBjddD3_PRL9ul7gYOcChD3v_UqU47fBHn1gxElYDHJqBRahe-qKRe9QlXKHGNqrwRP-Y6CAWNUvgQIXaO0P6yKJ50VM8PFdi0cFyghVDHHlRmv2MIATF4u1Xzg3pm-8VilbdH12PAsymb8_Yn5P7HQa1ye2HDlbEvAWTVZJaVWe9UeVOGz6WhibwIZ-NXT3BIEMsCvpC70AUvmvftOulbtmDhf-z8DR-1XpeqCHTEJNOckmfgY2X0jJiFN1VeeOgtwxw"; // replace dynamically later

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();   // array with [{data:"string"}]

    const parsedJsonString = data[0].data;  // extract inner JSON string
    const parsed = JSON.parse(parsedJsonString); // convert string → object
    
    return res.json({
      data: parsed.data,
      metaData: parsed.metaData
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch from remote API" });
  }
});

app.get("/", (req, res) => {
  res.send("Server running using fetch() 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
