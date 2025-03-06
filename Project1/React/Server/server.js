// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

// JSON 파일에서 members 데이터 읽어오기
const membersFilePath = path.join(__dirname, 'members.json');
let members = require(membersFilePath);

// 로그인: 입구 열쇠(토큰) 발급
app.post('/login', (req, res) => {
  const { userId, password } = req.body;
  const member = members.find(m => m.userId === userId && m.password === password);
  if (!member) {
    return res.status(401).json({ error: '로그인 실패' });
  }
  // 토큰에 role 정보도 포함
  const token = jwt.sign({ userId: member.userId, role: member.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ role: member.role, token });  // 응답 한 번만 보내도록 수정
});

// 회원 생성 (Create)
app.post('/members', (req, res) => {
  const newMember = { ...req.body, role: req.body.role || 'vendor' }; // role 기본값 설정
  const exists = members.find(m => m.userId === newMember.userId);
  if (exists) {
    return res.status(400).json({ error: '이미 존재하는 회원입니다.' });
  }
  members.push(newMember);
  // JSON 파일에 저장 (파일도 업데이트)
  fs.writeFileSync(membersFilePath, JSON.stringify(members, null, 2));
  res.status(201).json(newMember);
});

// 전체 회원 조회 (Read all)
app.get('/members', (req, res) => {
  res.json(members);
});

// 개별 회원 조회 (Read one)
app.get('/members/:userId', (req, res) => {
  const userId = req.params.userId;
  const member = members.find(m => m.userId === userId);
  if (!member) {
    return res.status(404).json({ error: '회원 없음' });
  }
  res.json(member);
});

// 회원 정보 수정 (Update)
app.put('/members/:userId', (req, res) => {
  const userId = req.params.userId;
  const index = members.findIndex(m => m.userId === userId);
  if (index === -1) {
    return res.status(404).json({ error: '회원 없음' });
  }
  members[index] = { ...members[index], ...req.body };
  fs.writeFileSync(membersFilePath, JSON.stringify(members, null, 2));
  res.json(members[index]);
});

// 회원 삭제 (Delete)
app.delete('/members/:userId', (req, res) => {
  const userId = req.params.userId;
  const index = members.findIndex(m => m.userId === userId);
  if (index === -1) {
    return res.status(404).json({ error: '회원 없음' });
  }
  const deleted = members.splice(index, 1);
  fs.writeFileSync(membersFilePath, JSON.stringify(members, null, 2));
  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
