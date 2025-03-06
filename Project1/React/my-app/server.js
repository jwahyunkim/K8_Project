const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// JSON 파일 경로 (위치에 맞게 수정)
const dataPath = path.join(__dirname, 'src', 'dummyData', 'VisitorManagement1.json');


// JSON 파일 읽기
let dummyData = [];
try {
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  dummyData = JSON.parse(fileContent);
} catch (error) {
  console.error("JSON 파일 읽기 에러:", error);
}

// 웹소켓 서버 생성 (포트 8080)
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('웹소켓 서버 시작 (포트 8080)');
});

// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws) => {
  console.log('클라이언트 연결됨');
  // 연결되면 더미 데이터 전송
  ws.send(JSON.stringify(dummyData));

  ws.on('message', (message) => {
    console.log(`받은 메시지: ${message}`);
  });

  ws.on('close', () => {
    console.log('클라이언트 연결 종료');
  });
});
