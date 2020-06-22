const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function idValid(req, res, next) {
  const{ id } = req.params;

  if (!isUuid(id)){
    return res.status(400).json({
        error: "Invalid Repository id!"
    })
  }
  return next();
}

app.use('/repositories/:id', idValid);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  repositories.push(repo);

  // return response.status(200).send({
  //   message: "Repository created success!",
  //   data: repo
  // })
  // return response.status(200).send({
  //   message: "Repository created success!",
  //   data: repo
  // })
  return response.json(repo);

});

app.put("/repositories/:id", (request, response) => {

  // Verifica se o id é no formato uuid

  const{ id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
    response.status(400).json({
      message: "Repository not found!",
      id: id
    })
  }

  const { title, url, techs} = request.body;

  const repo = repositories[repoIndex];
  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  return response.json(repositories[repoIndex]); 
  // return response.status(201).json({
  //   message: "Repository changed success!",
  //   data: repositories[repoIndex]
  // }); 


});

app.delete("/repositories/:id", (request, response) => {
  const{ id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
    response.status(400).json({
      message: "Repository not found!",
      id: id
    })
  }
  repositories.splice(repoIndex,1);
  response.status(204).json({
    message: "Repository deleted succeed!"
  })
  // response.status(204).json({
  //   message: "Repository deleted succeed!"
  // })
});

app.post("/repositories/:id/like", (request, response) => {
  const{ id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
    response.status(400).json({
      message: "Repository not found!",
      id: id
    })
  }
  repositories[repoIndex].likes++;

  response.status(200).json({
      likes: repositories[repoIndex].likes
  })
  // response.status(200).json({
  //   message: "Like incremented succeed!",
  //   data: {
  //     likes: repositories[repoIndex].likes
  //   }
  // })

});

module.exports = app;
