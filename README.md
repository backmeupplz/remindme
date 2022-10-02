# @remindme Farcaster bot

## Installation and local launch

1. Clone this repo: `git clone https://github.com/backmeupplz/remindme`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                 | Description                         |
| -------------------- | ----------------------------------- |
| `MONGO`              | URL of the mongo database           |
| `FARCASTER_MNEMONIC` | Mnemonic of bot's farcaster account |
| `USERNAME`           | Username of the bot                 |

Also, please, consider looking at `.env.sample`.
