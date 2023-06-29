const config = require('config');
const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github2');

const { db } = require('../middlewares/mysql');
const User = require('../models/mysql/user');

const { clientId: githubClientId, secret: githubSecret } = config.get('github');
const { host: appHost, port: appPort } = config.get('app');

passport.use(new GitHubStrategy({
    clientID: githubClientId,
    clientSecret: githubSecret,
    callbackURL: `http://${appHost}:${appPort}/github/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = new User(db);
            let authUser = await user.findByGithubId({
                githubId: profile.id.toString()
            });
            
            if (authUser.length === 0) {
                const insertedUser = await user.add({
                    githubId: profile.id.toString()
                });

                authUser = await user.findByPk({
                    id: insertedUser.insertId
                });
            }

            return done(null, authUser[0]);
        } catch (err) {
            return done(null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;