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
  const { data, meta } = await client.backups.list('fbb9784b');

  console.log(data[0]);
  console.log(meta.backup_count);
} catch (err) {
  console.error(err);
}
```

If a function throws, you will get an **Error** that is as accurate and descriptive as possible.

Here is an example **Error** from trying to create a backup on a server that has already reached its limit:

`PterodactylError: Status: 400 (TooManyBackupsException): Cannot create a new backup, this server has reached its limit of 0 backups.`

Addionally, every method that is available to the consumer has `documentation comments` that describe:

- what the method **does**
- what the method **returns**
- what the **parameters** are
- **how** to use it (including an **example**)

This gives you documentation of the available features directly in your IDE.

It is strongly recommended to use this library with [Typescript](https://www.typescriptlang.org/) because it is specifically made with maximum type-safety in mind. Additionally you get nice auto-complete ~~and we all know that this is a good selling point for TS~~.

If you want to contribute, suggest features or just talk to me about anything, consider joining my [Discord Server](https://discord.gg/wmJ3WBYcZF), open an [issue](https://github.com/defnot001/ptero-client/issues) or [email](mailto:defnot001@gmail.com) me!
