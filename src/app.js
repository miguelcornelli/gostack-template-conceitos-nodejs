const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  let repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoriesIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoriesIndex === -1) {
    return response.status(400).json({ error: "Repository does not exists." });
  }

  let repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoriesIndex].likes,
  };

  repositories[repositoriesIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoriesIndex >= 0) {
    repositories.splice(repositoriesIndex, 1);
  } else {
    return response.status(400).json({ error: "Repository does not exists." });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.find((repo) => repo.id === id);

  if (!repositoriesIndex) {
    return response.status(400).json({ error: "Repository does not exists." });
  }

  repositoriesIndex.likes += 1;

  return response.json(repositoriesIndex);
});

module.exports = app;
