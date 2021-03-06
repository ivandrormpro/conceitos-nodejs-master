
const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id }= request.params;

  if(!isUuid(id)){
      return response.status(400).json({error : "Invalid repository ID"});
  }

  return next();
}


app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  likes = 0;
  const repositorie = {
    id : uuid(),
    title,
    url,
    techs,
    likes
  }
  repositories.push(repositorie);

  return response.json(repositorie)
});

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {

  const {id} = request.params;
  const {title, url, techs} = request.body;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if (repositorieIndex < 0){
      return response.status(400).json({ error:"Repositorie not found" });
  }

  const likes = repositories[repositorieIndex].likes;

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositorieIndex] = repositorie;
  return response.json(repositorie)

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {

  const {id} = request.params;
  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if (repoIndex < 0){
      return response.status(400).json({ error:"Repositorie not found" });
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if (repositorieIndex < 0 ){
      return response.status(400).json({ error:"Repositorie not found" });
  }

  ++repositories[repositorieIndex].likes;

  return response.status(200).json(repositories[repositorieIndex]);
});

module.exports = app;
