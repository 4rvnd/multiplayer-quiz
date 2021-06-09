module.exports = {
    service: {
        name: 'authservice'
    },
    server: {
        url: 'http://127.0.0.1:8000',
        ip: '127.0.0.1',
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
