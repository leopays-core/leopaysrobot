# LeoPaysRoBot
> Telegram Bot for Mainnet [@LeoPaysRoBot](https://t.me/LeoPaysRoBot).
> Telegram Bot for Testnet [@LeoPaysRoBot](https://t.me/LeoPaysTestnetRoBot).


## install MongoDb MacOS
> https://www.mongodb.com/try/download/community
```bash
brew tap mongodb/brew
brew install mongodb-community
```

## install Node.js
> https://nodejs.org/en/download/
```bash
brew install node
brew install yarn
```

## install LeoPaysRoBot
**Step 1**
```bash
git clone https://github.com/leopays-core/leopaysrobot.git
cd leopaysrobot
yarn install
```

**Step 2**
```bash
mkdir ./data
cp config.json ./data
```
Edit params in `./data/config.json`

**Step 3**
```bash
yarn start:prod
```

### leopays/leopaysrobot
> https://hub.docker.com/repository/docker/leopays/leopaysrobot
