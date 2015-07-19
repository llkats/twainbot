# twainbot

variations on a misattributed quote; because the world needs another twitterbot

## Setup

After cloning the repo, install dependencies and copy the local configuration file:

    npm install
    cp local.json-dist local.json

Create a Twitter and a Wordnik accounts and sign up for each respective service's API. Enter the keys into the appropriate spots in `local.json`.

Then start the server:

    npm start

## Credits

City name list (`data/cities-processed.txt`) copied and gently formatted from [substack](http://substack.net/)'s [cities1000 dataset](https://github.com/substack/cities1000/).

README development instructions shamelessly cribbed from [big boring system](https://github.com/ednapiranha/bigboringsystem).

Big ups to the teams behind the [Twitter API](https://dev.twitter.com/overview/documentation) and the [Wordnik API](http://developer.wordnik.com/).

And to Mark Twain, who never said that.

![http://www.wearysloth.com/Gallery/ActorsH/tve7422-19920921-322.gif](http://www.wearysloth.com/Gallery/ActorsH/tve7422-19920921-322.gif)
