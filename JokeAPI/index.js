import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Function to get a random joke
async function getRandomJoke() {
  const response = await axios.get(API_URL + "Any");
  return response.data;
}

app.get("/", async (req, res) => {
  try {
    const result = await getRandomJoke();
    res.render("index", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const categoryOption = req.body.categoryOption || "Any";
    const typeOption = req.body.typeOption || "";
    const flags = req.body.flags || [];

    let apiUrl = `${API_URL}${categoryOption}`;

    const params = [];
    if (flags.length > 0) {
      params.push(`blacklistFlags=${flags.join(",")}`);
    }
    if (typeOption) {
      params.push(`type=${typeOption}`);
    }

    if (params.length > 0) {
      apiUrl += `?${params.join("&")}`;
    }

    const response = await axios.get(apiUrl);
    const result = response.data;
    res.render("index", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index", {
      error: "No jokes found that match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
