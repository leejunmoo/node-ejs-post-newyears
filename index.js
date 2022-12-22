const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const moment = require('moment'); // 날짜구하는 npm 모듈
const today = moment().format("YYYY-MM-DD");


// 글 DB
let posts = [];
let postsName = [];
let postsDate = [];
const readfile = fs.readFileSync('postDB.json', 'utf-8');
const redafileName = fs.readFileSync('postnameDB.json', 'utf-8');
const redafileDate = fs.readFileSync('postdateDB.json', 'utf-8');

// 오브젝트 코드로 변환
const jsonData = JSON.parse(readfile);
const jsonnameData = JSON.parse(redafileName);
const jsondateData = JSON.parse(redafileDate);
// console.log(jsonData);
posts = [...jsonData]; // post에 배열값 추가
postsName = [...jsonnameData];
postsDate = [...jsondateData];

// post 요청시 필요
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// ejs를 view 엔진으로 설정
app.set('view engine', 'ejs');

// 정적파일 경로 지정
app.use(express.static("public"));

// home
app.get('/', function(요청, 응답){
  응답.render('pages/index.ejs', { posts, postsName, postsDate, today })
})

// create
app.post('/create', function(req, res) {
 
  const 글 = req.body.post;
  const name = req.body.postName;
  const date = req.body.date;
  postsDate.push(date);
  postsName.push(name);
  posts.push(글);

  // posts 배열에 글추가
  console.log(postsDate);
  // DB file 에 글 저장
  fs.writeFileSync('postDB.json', JSON.stringify(posts))
  fs.writeFileSync('postnameDB.json', JSON.stringify(postsName))
  fs.writeFileSync('postdateDB.json', JSON.stringify(postsDate))
  // 홈(게시판)으로 이동
  res.redirect('/');
})

// 글 삭제 요청
app.post('/delete/:id', function(req, res){
  const id = req.params.id;
  //  누르는 버튼에 해당하는 id 삭제
  posts.splice(id, 1)
  fs.writeFileSync('postDB.json', JSON.stringify(posts))
  res.redirect('/');

})


const port = 3001;
app.listen(port, () => {
  console.log(`server running at ${port}`)
})