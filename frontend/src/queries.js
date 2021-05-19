import {gql} from '@apollo/client';

const LOGIN_USER = gql`
    query loginUser($email: String!, $password: String!){
        login(email: $email, password: $password) {
            AccessToken
        }
    }
`

const ADD_USER = gql`
    mutation registerUser($username: String!, $userID: ID!){
        addUser(username: $username, userID: $userID){
            userID
            username
        }
    }
`

const CHECK_USERNAME = gql`
    query ($username: String!){
        checkUsername(username: $username)
    }
`

const REMOVE_USER = gql`
    mutation removeUser($id: String!){
        deleteUser(id: $id){
            email
        }
    }
`

const GET_ALL_ROOMS = gql`
    query { 
        rooms {
            stockSymbol
            activeUsers
        }
    }
`

const GET_ROOM_DATA = gql`
    query ($ticker: String!){
        getRoom(stockSymbol: $ticker){
            activeUsers
            messages{
                author
                time
                text
            }
        }
    }
`

const GET_TOP_MOVERS = gql`
    query{
        topMovers{
            stockSymbol
            activeUsers
        }
    }
`

const GET_POPULAR = gql`
    query{
        getTopMentions{
            stockSymbol
            activeUsers
        }
    }
`


const GET_LOGGED_IN_USERS = gql`
    query{
        getUsers{
            _id
            username
        }
    }
`

const GET_STOCK_DATA = gql`
    query ($ticker: String!){
        getStock(symbol: $ticker){
            symbol
            name
            prices{
                date
                value
            }
            chart{
              days{
                date
                value
              }
              weeks{
                date
                value
              }
            }
              
            daily{
                date
                value
            }
        }
    }
`

const GET_USERNAME = gql`
    query($userID: String!){
        getUserById(id: $userID){
            username
        }
    }
`

const GET_STOCK_LIST = gql`
    query($tickerList: [String]!){
        getStocks(symbols:$tickerList){
    		symbol
    		daily{
                date
                value
            }
        }
    }
`
const GET_INDEXES = gql`
    query{
        indexes{
            DOW{
                symbol
                    prices{
                        date
                        value
                    }
                }
            NASDAQ{
                symbol
                    prices{
                        date
                        value
                    }
                }
            SP{
                symbol
                    prices{
                        date
                        value
                    }
                }
        }
    }
`
const GET_FAVORITE_ROOMS = gql`
    query($userToken: String!){
        getUserFavorites(userToken: $userToken){
            stockSymbol
            activeUsers
        }
    }
`

const ADD_FAVORITE = gql`
    mutation($userToken: String!, $ticker: String!){
        addToFavorites(userToken: $userToken, stockSymbol: $ticker){
            username
        }
    }
`
const REMOVE_FAVORITE = gql`
    mutation($userToken: String!, $ticker: String!){
        removeFromFavorites(userToken: $userToken, stockSymbol: $ticker){
            username
        }
    }
`

const GET_STOCK_INFO = gql`
    query($symbol: String!){
        getStock(symbol: $symbol){
            symbol
        		stockInfo{
              assetType
              description
              exchange
              industry
              analystTargetPrice
            }
        }
    }
`



export default {
  ADD_FAVORITE,
  GET_POPULAR,
  REMOVE_FAVORITE,
  GET_FAVORITE_ROOMS,
  GET_INDEXES,
  GET_STOCK_LIST,
  GET_USERNAME,
  GET_ROOM_DATA,
  GET_STOCK_DATA,
  CHECK_USERNAME,
  LOGIN_USER,
  ADD_USER,
  REMOVE_USER,
  GET_LOGGED_IN_USERS,
  GET_TOP_MOVERS,
  GET_ALL_ROOMS,
  GET_STOCK_INFO
}
