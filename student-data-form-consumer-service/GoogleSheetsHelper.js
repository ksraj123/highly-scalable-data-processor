import { Buffer } from 'buffer';
import { google } from 'googleapis';
import { fields } from './models/kafkaEventModel.js';
import { ENV, CLIENT_EMAIL, PRIVATE_KEY } from './env.js';

export default class GoogleSheetsHelper {
    
    constructor() {
        const googleSheetsApiCredentials = ENV === 'Docker'? {
            privateKey:  Buffer.from(PRIVATE_KEY, 'base64').toString('ascii'),
            clientEmail: Buffer.from(CLIENT_EMAIL, 'base64').toString('ascii')
        } : {
            privateKey:  PRIVATE_KEY,
            clientEmail: CLIENT_EMAIL
        }
        this.spreadsheetId = '16cAsR7LjVYj66gxhVVMAriMxwWdAXb3lxBN4raCAbh4';
        this.client = new google.auth.JWT(
            googleSheetsApiCredentials.clientEmail, // client email
            null,
            `-----BEGIN PRIVATE KEY-----\n${googleSheetsApiCredentials.privateKey}\n-----END PRIVATE KEY-----`, // private key
            ['https://www.googleapis.com/auth/spreadsheets'] 
        );
        this.authorizeClient();
    }

    authorizeClient() {
        this.client.authorize((err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log('connected!');
                this.sheetsApi = google.sheets({version: 'v4', auth: this.client});
            }
        })
    }

    columnToLetter(column) {
        let temp, letter = '';
        while (column > 0)
        {
            temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter;
    }

    async appendToSheet(data) {
        const sheetColumnOrder = fields.map(field => field.name);
        const dataToAppend = data.map(ele => {
            return sheetColumnOrder.map(field => ele[field])
        });
        const request = {
            spreadsheetId: '16cAsR7LjVYj66gxhVVMAriMxwWdAXb3lxBN4raCAbh4',
            range: `Sheet1!A:${this.columnToLetter(sheetColumnOrder.length)}`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                "majorDimension": "ROWS",
                "values": dataToAppend
            },
            auth: this.client,
        };
    
        try {
            const response = (await this.sheetsApi.spreadsheets.values.append(request)).data;
            console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
};
