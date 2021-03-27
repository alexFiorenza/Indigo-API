# Indigo API

## Features

- Database: MongoDB
- Mongoose: MongoDB ODM
- Backend Language: NodeJS (javascript)
- Image Uploading
- Heroku hosting
- Google cloud platform for file storage
- 💰 [Mercadopago API](https://github.com/mercadopago/dx-nodejs)
- 🚌[Andreani API](https://developers.andreani.com/documentacion)
- ✉️[SendGrid API ](https://sendgrid.com/)

#### Env variables

| Key                      | Value                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| DEV                      | This property must be set just in the development enviorment            |
| DB_USER_PASSWORD         | Password to connect to mongodb cluster as admin user                    |
| DB_USER_NAME             | Username to connect to mongodb cluster admin                            |
| DB_CLUSTER               | Cluster to connect in mongodb                                           |
| DB_NAME                  | Name of db related to the cluster                                       |
| GCP_KEY_FILE             | The gcp json name in which all the gcp json credentials should be saved |
| GCP_CRED                 | Json credentials for gcp service                                        |
| JWT_SECRET               | Value for jsonwebtoken encryption                                       |
| PUBLIC_KEY               | This is the given key by mercadopago                                    |
| ACCESS_TOKEN_MP          | The token given by mercadopago to use when proccesing payments          |
| USER_ANDREANI            | User to login in andreani API                                           |
| PASSWORD_ANDREANI        | Password to login in andreani API                                       |
| ANDREANI_URL             | Url to make requests in andreani API                                    |
| CLIENT_ANDREANI          | Client code andreani                                                    |
| BRANCH_OFFICE_SHIPPING   | Contract code to send to a branch office                                |
| STANDARD_SHIPPING        | Contract code to send to an address                                     |
| FAST_SHIPPING            | Contract code to fast shipping                                          |
| OWNER_COMPLETE_NAME      | Owner name of the andreani account                                      |
| OWNER_EMAIL              | Owner email of the andreani account                                     |
| OWNER_DOCTYPE            | Type of documentation andreani account                                  |
| OWNER_DOCNUMBER          | Documentation number of the andreani account                            |
| EMAIL_API_KEY            | Sengrid api key                                                         |
| EMAIL_SENDER_ADDRESS     | Sender of the emails                                                    |
| EMAIL_SENDER_NAME        | Name of the sender                                                      |
| TRANSACTION_COMPLETED_ID | ID of the transaction completed template                                |
| UPDATE_ORDER_STATUS      | ID of an update in order status template                                |

## 👩🏻‍💻 Development | Installation

1. Install dependencies with:

`$ npm install`

2. Create uploads folder (image uploading) and .env file for environment variables

3. Open your browser and go to http://localhost:3000/

4. API functions are available at .../api/ url

### POSTMAN testing requests

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/bcfc59d416754a129af0)

## Social media

#### [Instagram](https://www.instagram.com/fiorenza_alex/?hl=es-la)

#### [Twitter](https://twitter.com/fi0renza_alex)

#### [Github](https://github.com/alexFiorenza)

# Contact

**alexfiorenza2012@gmail.com**
