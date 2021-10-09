"use strict";

const {
    getUserById,
    createNewUserWithId,
    updateUserWithMaze,
    deleteUserById,
  } = require("./stateDB.js"),
  {
    handleNotAValidSolution,
    handleNoValidMaze,
    handlePostback,
    sendInitialGreetings,
    sendTutorial,
    handleMazeSelection,
    handleQuit,
    handleSolutionResponse,
  } = require("./response.js"),
  {
    generateMaze,
    isSolutionValid,
    destructureSolution,
    checkSolution,
  } = require("./algorithm.js"),
  express = require("express"),
  bodyParser = require("body-parser"),
  app = express().use(bodyParser.json());

app.listen(process.env.PORT || 3000, () =>
  console.log(`webhook is listening on port:${process.env.PORT || "3000"}`)
);

app.post("/webhook", (req, res) => {
  let body = req.body;
  if (body.object === "page") {
    let userID, userMessage, userPostback;
    body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      userID = webhook_event.sender.id;
      userMessage = webhook_event.message;
      userPostback = webhook_event.postback;
    });

    getUserById(userID)
      .then((response) => {
        let userInfo = response.Item;
        if (userInfo && userPostback) {
          const difficulty = {
            easy: [13, 7],
            medium: [13, 9],
            hard: [13, 11],
          };

          const row = difficulty[userPostback.payload][0];
          const col = difficulty[userPostback.payload][1];
          const [maze, startAndEnd] = generateMaze(row, col);
          userInfo.maze = maze;
          userInfo.start = startAndEnd[0];
          userInfo.end = startAndEnd[1];
          updateUserWithMaze(userID, maze, startAndEnd[0], startAndEnd[1]);
          handlePostback(userID, userPostback, userInfo);
        } else if (userInfo && userMessage) {
          if (
            userMessage.text.toLowerCase() === "quit" ||
            (userMessage.quick_reply !== undefined &&
              userMessage.quick_reply.payload.toLowerCase() === "quit")
          ) {
            deleteUserById(userID);
            return handleQuit(userID, userMessage, userInfo);
          } else if (
            userMessage.text.toLowerCase() === "maze" ||
            (userMessage.quick_reply !== undefined &&
              userMessage.quick_reply.payload.toLowerCase() === "maze")
          ) {
            return handleMazeSelection(userID, userMessage);
          } else if (
            userMessage.text.toLowerCase() === "tutorial" ||
            (userMessage.quick_reply !== undefined &&
              userMessage.quick_reply.payload.toLowerCase() === "tutorial")
          ) {
            return sendTutorial(userID, userMessage);
          } else if (
            isSolutionValid(userInfo.maze, userMessage.text.toLowerCase())
          ) {
            const maze = userInfo.maze,
              start = userInfo.start,
              end = userInfo.end;
            const solution = userMessage.text.toLowerCase().split(",");
            const destructuredSolution = destructureSolution(solution);
            console.log(destructuredSolution);
            const response = checkSolution(
              maze,
              start,
              end,
              destructuredSolution
            );
            console.log(response);
            return handleSolutionResponse(
              userID,
              userMessage,
              userInfo,
              response
            );
          } else if (userInfo.maze.length === 0) {
            return handleNoValidMaze(userID);
          } else {
            return handleNotAValidSolution(userID, userMessage, userInfo);
          }
        } else {
          createNewUserWithId(userID, [], [], []);
          sendInitialGreetings(userID);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  let VERIFY_TOKEN = process.env.verification_token;

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});
