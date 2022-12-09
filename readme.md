# Pterodactyl API Client

Ptero-client is wrapper around the official [API](https://dashflo.net/docs/api/pterodactyl/v1/) for the [Pterodactyl](https://pterodactyl.io/) panel using [axios](https://github.com/axios/axios). It is designed for ease of use and type safety. All the responses are strongly typed using [Typescript](https://www.typescriptlang.org/).

This project will be published as a npm-package once all client endpoints are covered.

---

## Guide

To get started, install the package:

```bash
npm install ptero-client
```

Then you will need to import the Class and instanciate it with the URL of your panel and your client API key:

```ts
import PteroClient from 'ptero-client';

const client = new PteroClient({
  hostURL: 'https://panel.example.com/',
  apiKey: '', // your api key
});
```

After that you are ready to use it for example like this. Make sure to catch Errors as all the methods will throw if they fail to succeed at what they are meant to do:

```ts
try {
  const backups: PteroBackupListResponseData = await client.listBackups(
    'b5e8b2e0',
  );
  console.log(backups);
} catch (error) {
  console.error(error);
}
```

If a function throws, you will get an Error that is as accurate and descriptive as possible. Alongside the error message, you also get a custom error object that you can use to handle different scenarios.

Here is an example custom error object from trying to create a backup on a server that has already reached it's limit:

```ts
  code: 'TooManyBackupsException',
  status: '400',
  detail: 'Cannot create a new backup, this server has reached its limit of 5 backups.'
```

If you want to contribute, suggest features or just talk to me about anything, consider joining my [Discord Server](https://discord.gg/wmJ3WBYcZF), open an [issue](https://github.com/defnot001/ptero-client/issues) or [email](mailto:defnot001@gmail.com) me!
