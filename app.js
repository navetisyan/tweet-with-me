const config = require('./config')
const twit =  require('twit')

const T = new twit(config)

function tweet(myTweet){
    T.post('statuses/update', { status: myTweet }, (resp)=> {console.log('tweeted:', resp)});
}

function retweet(searchText) {
    // Params to be passed to the 'search/tweets' API endpoint
    let params = {
        q : searchText + '',
        result_type : 'mixed',
        count : 1,
    }

    T.get('search/tweets', params, function(err, data, response){

        let tweets = data.statuses
        if (!err)
        {
            let tweetIDList = []
            for(let tweet of tweets) {
                tweetIDList.push(tweet.id_str);

                //to avoid duplication of retweets..
                if(tweet.text.startsWith("RT @")){
                    if(tweet.retweeted_status){
                        tweetIDList.push(tweet.retweeted_status.id_str);
                    } else {
                        tweetIDList.push(tweet.id_str);
                    }
                } else {
                    tweetIDList.push(tweet.id_str);
                }
            }

            // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
            for (let tweetID of tweetIDList) {
                T.post('statuses/retweet/:id', {id : tweetID}, function(err_rt, data_rt, response_rt){
                    if(!err_rt){
                        console.log("\n\nRetweeted! ID - " + tweetID)
                    }
                    else {
                        console.log("\nError... Duplication maybe... " + tweetID)
                        console.log("Error = " + err_rt)
                    }
                })
            }
        }
        else {
            console.log("Error while searching" + err_search)
            process.exit(1)
        }
    })
}

tweet('#PeaceForArmenians');
retweet('#RecognizeArtsakh');