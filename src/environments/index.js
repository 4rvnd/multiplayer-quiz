module.exports = {
    service: {
        name: 'authservice'
    },
    server: {
        url: 'http://3.143.215.77:8000',
        ip: '3.143.215.77',
        port: 8000,
    },
    auth: {
        jwtSecret: 'secret',
    },
    db: {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "Admin@1234",
        DB: "multiplayer_game",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};
