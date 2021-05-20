# shifts - Final Project for CS554

With stocks becoming easier for the average person to begin investing in, the idea of shifts is to provide a community where like-minded investors can chat about a certain stock. The list of featured stocks will be updated on a daily basis through web scraping various news outlets and online communities to get the top mentioned stock tickers. Other stock tickers’ chat rooms will be available through a search functionality.

To facilitate discussion, each chatroom for a ticker will have its daily, monthly, 3-month, 1-year, and 5-year charts showing its performance. Other data included would be the general description of the company’s operations, the CEO, where it is located, when it was founded, the market cap, and its average volume. On this page, logged in users will be able to comment under the ticker with their own due diligence, their current positions, or how they think the stock will perform. Additionally, the users will be able to reply to chats from other users to help further allow for a deeper discussion. We believe that hosting an application where users can come together to discuss investing will allow for the topic to reach younger audiences, and help them build a better understanding of financial responsibility.

## Written walkthrough 

Once you get to shifts.tv, sign up for an account! After you've done that, you can go into your dashboard and you'll see four columns. They showcase the stocks that had the biggest percent increase or decrease for the day in our database, the most popular stocks that we have found after scraping the Internet, your favorite list of stocks, and all active stock rooms. You can click one of the stock buttons to check out the stock room, or you can search for a specific stock in our database. In there, you'll see more information about the stock as well as a chart showcasing the stock's performance over time. Most importantly, you can talk to whoever is in the same room with you about the stock! Users can enter, send messages and leave a stock room and it'll all be updated in real time.

## What technologies did you use? 

NodeJS, React, GraphQL, Redis, Firebase, Heroku, Recharts, Socket.io, Workers

APIs: Alphavantage Go, Finnhub

## Instructions on how to run

We used Heroku to enable CI/CD, which can be accessed at this link: https://shifts-frontend-s2021.herokuapp.com/ 

If you'd like to spin up your own local instance: 

1. Clone the repo
2. ```npm i``` in the backend folder and ```npm i``` in the frontend folder
3. Start Redis by typing in ```redis-server``` in a terminal 
4. Once ```npm i``` finishes for both the backend folder and frontend folder, run ```npm start```in both folders to run the backend and the frontend respectively. 

The application should be running after these steps. We have also sent credentials to a Firebase database to you via email for the local instance and the Heroku instance if you'd like to monitor how the database changes during operations.

## Accounts (Heroku)

|        Email         |  Username  | Password |
|----------------------|------------|----------|
| ealtenx@gmail.com    | ealtenbu   | abcd1234 |
| smax@gmail.com       | smax       | abc123   |
| dkim@gmail.com       | dkim       | abc123   |
| phill@stevens.edu    | phill      | abc123   |
| graffix@gmail.com    | graffixnyc | abc123   |
| borowski@gmail.com   | borowski   | abc123   |
| ebonelli@gmail.com   | ebonelli   | abc123   |
| DFV@gmail.com        | DFV        | abc123   |
| hnizami1@stevens.edu | nizzy      | password |


## Giving Credit 
To scrape Reddit, we modified github user andrews1022's reddit stock scrapper. The original stock scraper can be found here: https://github.com/andrews1022/reddit-stock-scraper. It gets one subreddit's top X most mentioned stocks. We modified it so that it pulls from multiple subreddits and then normalizes each totalMentioned count so that one subreddit with a lot of subscribers does not overpower the rest of the subreddits. We'd like to thank andrews1022 for having the code be open-sourced and all credit goes to his original implementation. 


## Authors 
Max Shi, Hamzah Nizami, Daniel Kimball, Eric Altenburg
