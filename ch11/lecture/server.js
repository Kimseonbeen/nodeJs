const app = require('./app');

// >npx sequelize db:create --env test : test db 생성

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})