const request = require("request");

const responsePostback = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Lựa chọn mê cung:",
      buttons: [
        {
          type: "postback",
          title: "Kích thước 5x11",
          payload: "easy",
        },
        {
          type: "postback",
          title: "Kích thước 7x11",
          payload: "medium",
        },
        {
          type: "postback",
          title: "Kích thước 9x11",
          payload: "hard",
        },
      ],
    },
  },
};

const responseQuickReply = {
  text: "Selections:",
  quick_replies: [
    {
      content_type: "text",
      title: "Chơi",
      payload: "maze",
    },
    {
      content_type: "text",
      title: "Thoát",
      payload: "quit",
    },
    {
      content_type: "text",
      title: "Hướng dẫn",
      payload: "tutorial",
    },
  ],
};

const sendInitialGreetings = (sender_psid) => {
  const responseMsg = {
    text: `Chào mừng đến với game của team Phở Bò - một bot thử thách mã hóa mê cung nhỏ. Chú bot thông minh của bọn tớ sẽ tạo ra một mê cung ngẫu nhiên dựa trên các kích thước bạn chọn và nhiệm vụ là tìm đường đi tới bát phở bằng cách gửi cho bọn mình một đoạn code. Chọn "hướng dẫn" để biết thêm thông tin nhé :>`,
  };

  callSendAPI(sender_psid, responseMsg)
    .then(() => {
      return callSendAPI(sender_psid, responseQuickReply);
    })
    .catch((error) => {
      console.log({ error });
    });
};

const sendTutorial = (sender_psid) => {
  const turnLeftRightMsg = {
    text: `Ví dụ di chuyển sang trái hoặc phải:\n   ⬛⬛⬛⬛⬛\n   ⬜⬜🏃⬜⬜\n   ⬛⬛⬛⬛⬛\nĐể di chuyển sang trái, nhắn "l" trên thanh chat, sang phải nhắn "r"\nKhi đó 'l,l' có kết quả như sau:\n   ⬛⬛⬛⬛⬛\n   ❌🟩🏃⬜⬜\n   ⬛⬛⬛⬛⬛\Hoặc khi bạn nhập code "r,r" kết quả sẽ như sau:\n   ⬛⬛⬛⬛⬛\n   ⬜⬜🏃🟩❌\n   ⬛⬛⬛⬛⬛\n`,
  };
  const moveUpDownMsg = {
    text: `Ví dụ di chuyển lên hoặc xuống:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛🏃⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\nĐể di chuyển lên trên, nhắn "u", di chuyển xuống nhắn "d"\nKhi đó 'u,u' có kết quả như sau:\n   ⬛⬛❌⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🏃⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\nHoặc khi bạn nhập code "d,d", kết quả sẽ như sau:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛🏃⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛❌⬛⬛\n`,
  };
  const loopingMsg = {
    text: `Sử dụng vòng lặp:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛🏃⬛⬛\nĐể sử dụng vòng lặp, hãy nhắn như sau "loop(<số bước>-<hướng di chuyển>)"\nVí dụ 'loop(3-u)' sẽ như sau:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛❌⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🏃⬛⬛\nHoặc "loop(4-u)" kết quả như sau:\n   ⬛⬛❌⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🏃⬛⬛`,
  };

  callSendAPI(sender_psid, turnLeftRightMsg)
    .then(() => {
      return callSendAPI(sender_psid, moveUpDownMsg);
    })
    .then(() => {
      return callSendAPI(sender_psid, loopingMsg);
    })
    .then(() => {
      return callSendAPI(sender_psid, {
        text: "Mục tiêu là để thằng cu 🏃 này ăn phở🍜. Nếu syntax lỗi, bot sẽ cảnh báo cho bạn. Nếu code của bạn đâm vào tường hoặc không kết thúc tại vị trí bát phở, bot sẽ show hình ảnh đường đi hiện tại cho bạn. It is possible to pass through the target node and end up hitting a wall or landing on an empty node.\n\Luật chơi:\n- Mỗi thao tác cách nhau bởi dấu phẩy.\n- Một lần di chuyển (u,l,r,d), hoặc một lần dùng vòng lặp loop(<số bước>-<hướng>) được tính như 1 thao tác.\n- Đoạn code không được đâm vào tường.\n- Đoạn code phải không được đi ra ngoài vùng chơi.",
      });
    })
    .then(() => {
      return callSendAPI(sender_psid, responseQuickReply);
    })
    .catch((error) => {
      console.log({ error });
    });
};

const handleNotAValidSolution = (sender_psid, received_message, userInfo) => {
  callSendAPI(sender_psid, {
    text: `Code của bạn không hợp lệ. Hãy chắc chắn rằng bạn dùng dấu phẩy để ngăn cách các thao tác, và kiểm tra lại xem các thao tác đúng syntax hay chưa nhé :3`,
  })
    .then(() => {
      return callSendAPI(sender_psid, { text: received_message.text });
    })
    .then(() => {
      return callSendAPI(sender_psid, responseQuickReply);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleNoValidMaze = (sender_psid) => {
  callSendAPI(sender_psid, {
    text: `Bạn chưa chơi ván nào cả :<. Để làm trùm game này, hãy chọn "chơi" và pick một kích thước mê cung từ các tùy chọn đã cho.`,
  })
    .then(() => {
      return callSendAPI(sender_psid, responseQuickReply);
    })
    .catch((error) => {
      console.log(error);
    });
};

// when the user quits
const handleQuit = (sender_psid, received_message, userInfo) => {
  callSendAPI(sender_psid, {
    text: "Cảm ơn bạn đã thử trò chơi! Hẹn gặp lại sau nhá!",
  });
};

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback, userInfo) => {
  let responseMsg;
  const wallNode = "⬛";
  const openNode = "⬜";
  const start = "🏃";
  const end = "🍜";
  const maze = userInfo.maze;

  let mazeString = "";

  for (let i = 1; i < maze.length - 1; i++) {
    for (let j = 1; j < maze[i].length - 1; j++) {
      if (maze[i][j] === 1) {
        mazeString += wallNode;
      } else if (maze[i][j] === 0) {
        if (i === userInfo.start[0] && j === userInfo.start[1]) {
          mazeString += start;
        } else if (i === userInfo.end[0] && j === userInfo.end[1]) {
          mazeString += end;
        } else {
          mazeString += openNode;
        }
      }
    }
    mazeString += "\n";
  }

  responseMsg = {
    text: mazeString,
  };

  // Sends the response message
  callSendAPI(sender_psid, {
    text: `Đây là mê cung hiện tại cho bạn. Bạn có thể chọn "thoát" bất cứ lúc nào để ngừng chơi. Ngoài ra, bạn có thể chọn một mê cung mới bằng cách chọn nút "chơi" `,
  })
    .then(() => {
      return callSendAPI(sender_psid, responseMsg);
    })
    .then(() => {
      return callSendAPI(sender_psid, responseQuickReply);
    })
    .catch((error) => {
      console.log({ error });
    });
};

handleSolutionResponse = (
  sender_psid,
  received_message,
  userInfo,
  solutionResponse
) => {
  let responseMsg, explanationMsg, pathTaken;
  const wallNode = "⬛";
  const openNode = "⬜";
  const path = "🟩";
  const pathEnd = "❌";
  const start = "🏃";
  const end = "🍜";
  const maze = userInfo.maze;

  if (solutionResponse.success !== undefined) {
    explanationMsg = "Cách giải đúng! Siêu đó";
    pathTaken = solutionResponse.success;
  } else if (solutionResponse.failure !== undefined) {
    explanationMsg = "Đường đi của bạn bị đập vào tường hoặc tràn ra ngoài rồi :))";
    pathTaken = solutionResponse.failure;
  } else if (solutionResponse.incomplete !== undefined) {
    explanationMsg = "Đường đi của bạn chưa đến được điểm cuối!";
    pathTaken = solutionResponse.incomplete;
  } else {
    explanationMsg = "Code của bạn bị lỗi gì rồi :<";
    pathTaken = solutionResponse.failure;
  }

  let mazeString = "";
  let lastValidPosition = pathTaken[pathTaken.length - 1];
  const paths = new Set(pathTaken.map((element) => JSON.stringify(element)));

  for (let i = 1; i < maze.length - 1; i++) {
    for (let j = 1; j < maze[i].length - 1; j++) {
      if (maze[i][j] === 1) {
        mazeString += wallNode;
      } else if (maze[i][j] === 0) {
        if (i === userInfo.start[0] && j === userInfo.start[1]) {
          mazeString += start;
        } else if (i === userInfo.end[0] && j === userInfo.end[1]) {
          mazeString += end;
        } else if (
          paths.has(JSON.stringify([i, j])) &&
          i === lastValidPosition[0] &&
          j === lastValidPosition[1]
        ) {
          mazeString += pathEnd;
        } else if (paths.has(JSON.stringify([i, j]))) {
          mazeString += path;
        } else {
          mazeString += openNode;
        }
      }
    }
    mazeString += "\n";
  }

  responseMsg = {
    text: `${mazeString}`,
  };

  callSendAPI(sender_psid, responseMsg)
    .then(() => {
      return callSendAPI(sender_psid, { text: explanationMsg });
    })
    .then(() => {
      if (solutionResponse.success !== undefined)
        return callSendAPI(sender_psid, {
          text: `Thử một mê cung khác khum? Bạn có thể tối ưu đừng đi của mình bằng cách sử dụng loop`,
        });
      if (solutionResponse.failure !== undefined || solutionResponse.incomplete)
        return callSendAPI(sender_psid, { text: received_message.text });
    })
    .then(() => {
      return callSendAPI(sender_psid, responseQuickReply);
    })
    .catch((error) => console.log({ error }));
};

handleMazeSelection = (sender_psid, received_postback, userInfo) => {
  callSendAPI(sender_psid, responsePostback).catch((error) =>
    console.log(error)
  );
};

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  return new Promise((resolve, reject) => {
    request(
      {
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: process.env.page_access_token },
        method: "POST",
        json: request_body,
      },
      (err, res, body) => {
        if (!err) {
          console.log("message sent!");
          resolve("success");
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

module.exports = {
  handleMazeSelection,
  handleNotAValidSolution,
  handleNoValidMaze,
  handleSolutionResponse,
  handlePostback,
  sendInitialGreetings,
  sendTutorial,
  handleQuit,
};
