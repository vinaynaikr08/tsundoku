import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://tsundoku-server.ericswpark.com/v1')
    .setProject('65ccf0b6d76765229231');

export const account = new Account(client);
export { ID } from 'appwrite';
