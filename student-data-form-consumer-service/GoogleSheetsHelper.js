import { Buffer } from 'buffer';
import { google } from 'googleapis';

export default class GoogleSheetsHelper {
    
    constructor() {
        const googleSheetsApiCredentials = process.env.ENV === 'Docker'? {
            privateKey:  Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii'),
            clientEmail: Buffer.from(process.env.CLIENT_EMAIL, 'base64').toString('ascii')
        } : {
            privateKey:  process.env.PRIVATE_KEY,
            clientEmail: process.env.CLIENT_EMAIL
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

    async appendToSheet() {
        const request = {
            spreadsheetId: '16cAsR7LjVYj66gxhVVMAriMxwWdAXb3lxBN4raCAbh4',
            range: 'Sheet1!A:B',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                "majorDimension": "ROWS",
                "values": [["Row 1 Col 1","Row 1 Col 2"], ["Row 2 Col 1","Row 2 Col 2"]]
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
