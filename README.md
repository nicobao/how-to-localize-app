# Learn localization

This is a quick template with instructions on how to localize a React SPA end-to-end with i18next & Weblate.

## workflow

- 2 repositories: one with the main code (ex: `front-localized-template`), and one separate with only the `locales/` directory that only Weblate interact with
- Devs only push to the `public/locales/dev` directory.
- Once a release is done, the ops team copy-paste `public/locales` to the weblate-specific repository and merge it to the repo's main branch via a PR. This process is manual.
- Once pushed, Weblate will automatically be updated because of the webhook.
- Translators do their job & devs keep working
- Once translators finish their job, the ops team serve the react app previously released, and use a reverse proxy such as nginx to redirect the `/locales` route to a copy of the Weblate repo containing all the `/locales` translations
- repeat

To enable fast-feedback for translators, you should:
- add a cron job to your weblate instance that will commit every minutes or so (not push, just commit, locally)
- deploy the release of the React app release you're translating directly in the same server as where you deploy Weblate. This "translation" environment will help translators for fast feedback of the live app, because you can redirect the `/locales` routes to the location where Weblate is committing the changes.

## other possible workflow

From Weblate, you can directly trigger a PR to a branch of the same repo that the dev are working on.

But that means weblate will have write access to your repo.

That also makes version handling difficult without having some source branch that is ALWAYS in sync with the version you're trying to translate.

It turns out this condition is hard to comply with. The `main` branch usually evolves much faster than that is being translated in Weblate.

If you're not OK with having unstranslated strings, then you cannot do that.


## front-localizaed-template

[This is the frontend code](./front-localized-template), it's self explanatory.

We make one translation file per JS file.

## weblate

[Contains the weblate instructions](./weblate).

## License

Most of this work has originally been done within CIDgravity.

This repo is distributed under the [BSD+Patent license](https://opensource.org/licenses/BSDplusPatent)
