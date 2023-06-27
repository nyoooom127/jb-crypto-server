class User {
    constructor(db) {
        this.db = db;
    }

    async add({ github_id }) {
        return this.db.execute(`
            insert into users (github_id)
            values(?)
        `, [
            github_id
        ]);
    }

    async findByGithubId({ github_id }) {
        return this.db.execute(`
            select * from users where github_id = ?
        `, [
            github_id
        ])
    }
    
    async findByPk({ id }) {
        return this.db.execute(`
            select * from users where id = ?
        `, [
            id
        ])
    }
}

module.exports = User;