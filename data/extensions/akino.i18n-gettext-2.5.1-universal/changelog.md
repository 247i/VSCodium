## [2.5.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.5.0...v2.5.1) (2026-08-25)


### Bug Fixes

* preserve custom gettext domains ([600c402](https://github.com/akinoccc/i18n-gettext-vscode/commit/600c4027e433f3949cedb05b2d383c5a484a0220))

# [2.5.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.4.0...v2.5.0) (2026-05-29)


### Bug Fixes

* reorder import statements for clarity ([1521875](https://github.com/akinoccc/i18n-gettext-vscode/commit/1521875aca1e39fad1d1329da6aafd9a7ae6ff2d))


### Features

* support locale-specific background translation ([5aecfe7](https://github.com/akinoccc/i18n-gettext-vscode/commit/5aecfe706ed4c18aa842acd4d3ad22f0e90337ce))

# [2.4.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.3.0...v2.4.0) (2026-01-15)


### Features

* **config:** add request timeout configuration for AI requests ([8808e94](https://github.com/akinoccc/i18n-gettext-vscode/commit/8808e94719f75d1ae2280c08c9a3a939cf0b4a26))

# [2.3.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.2.0...v2.3.0) (2025-09-09)


### Features

* **i18n:** add extract and compile commands with localization support ([f9a07cd](https://github.com/akinoccc/i18n-gettext-vscode/commit/f9a07cd7ba3c2b814907403020067a53658bcfb6))

# [2.2.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.1.0...v2.2.0) (2025-08-16)


### Features

* **translation:** add plural form translation support and optimize AI config management ([b12fe41](https://github.com/akinoccc/i18n-gettext-vscode/commit/b12fe418bf1b8a921a874c5e68f03239855163ae))

# [2.1.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.0.1...v2.1.0) (2025-08-09)


### Features

* add LICENSE ([d49a64d](https://github.com/akinoccc/i18n-gettext-vscode/commit/d49a64d4b57d10faa443dbf4bab50c4d1365b835))

## [2.0.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v2.0.0...v2.0.1) (2025-08-09)


### Bug Fixes

* change repository url ([a0fe611](https://github.com/akinoccc/i18n-gettext-vscode/commit/a0fe611342a9893c755b62e1aa212d395f6e9326))

# [2.0.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.10.3...v2.0.0) (2025-08-09)


### Code Refactoring

* remove machine translations ([daa9f31](https://github.com/akinoccc/i18n-gettext-vscode/commit/daa9f31ac8d03d44995ca6a25852a99570a97e71))


### BREAKING CHANGES

* remove machine translations

## [1.10.3](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.10.2...v1.10.3) (2025-07-21)


### Bug Fixes

* remove domain type handling and custom type does not take effect ([ad42b59](https://github.com/akinoccc/i18n-gettext-vscode/commit/ad42b599aa938d395d1288519e34aae6a0f9059b))
* remove unused logger import from usePath.ts ([da13385](https://github.com/akinoccc/i18n-gettext-vscode/commit/da133859840ac314e89cb723bc78f860b8cc425a))

## [1.10.2](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.10.1...v1.10.2) (2025-07-18)


### Bug Fixes

* remove "AI" category from package.json ([065995e](https://github.com/akinoccc/i18n-gettext-vscode/commit/065995ea79969dbb19da0360a1fc9f68b8d96d9d))

## [1.10.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.10.0...v1.10.1) (2025-07-11)


### Bug Fixes

* **translation:** incorrect usage of  workspace folder path ([fedab18](https://github.com/akinoccc/i18n-gettext-vscode/commit/fedab1867eaeee1d623c6db2c406f8839f6f13e2))

# [1.10.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.9.1...v1.10.0) (2025-06-24)


### Features

* **workspace:** enhance workspace switching functionality ([f17310d](https://github.com/akinoccc/i18n-gettext-vscode/commit/f17310d8b0defd2ad00249061d7f9050a02dc44c))

## [1.9.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.9.0...v1.9.1) (2025-06-13)


### Bug Fixes

* **translation:** incorrect percentage(close [#1](https://github.com/akinoccc/i18n-gettext-vscode/issues/1)) ([fc25b28](https://github.com/akinoccc/i18n-gettext-vscode/commit/fc25b28b3cc230dc73d43f8c92dc9c0735092bc0))

# [1.9.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.8.1...v1.9.0) (2025-05-31)


### Features

* **translation:** add translation task cancellation logic to handle webview closure ([9e07667](https://github.com/akinoccc/i18n-gettext-vscode/commit/9e076675a331337431c1b93b71e1cba045a31f0b))

## [1.8.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.8.0...v1.8.1) (2025-05-30)


### Bug Fixes

* **providers:** underline of gettext function ([876e649](https://github.com/akinoccc/i18n-gettext-vscode/commit/876e6490831d4daee51752fa5e7113c47fe1da38))
* **useTranslationEntries:** incorrect findEntryById result ([c662ad6](https://github.com/akinoccc/i18n-gettext-vscode/commit/c662ad6fdd64d4588f61c3d35ef16a327a021ce2))

# [1.8.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.7.0...v1.8.0) (2025-05-11)


### Features

* Add workspace switching feature ([01f5295](https://github.com/akinoccc/i18n-gettext-vscode/commit/01f5295b45036d44f80db42acbfd3711bcbdf60a))
* set fuzzy as false when translation change manually ([be19236](https://github.com/akinoccc/i18n-gettext-vscode/commit/be192365e18703f09b7d19b27502574d48c51dc3))

# [1.7.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.7...v1.7.0) (2025-05-11)


### Bug Fixes

* disable ai translation button when no ai models config ([bea0e92](https://github.com/akinoccc/i18n-gettext-vscode/commit/bea0e92726d6bb7ca0a8f2d8e521d7a1ebe87ec4))


### Features

* improve AI configuration loading logic ([fc389f5](https://github.com/akinoccc/i18n-gettext-vscode/commit/fc389f5bc79507d757517713643da715dde7fb88))

## [1.6.7](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.6...v1.6.7) (2025-05-10)


### Bug Fixes

* recover animation of progress dialog ([ce0ef83](https://github.com/akinoccc/i18n-gettext-vscode/commit/ce0ef83706bfb1237a7bd0e02670ae059f9fdd11))

## [1.6.6](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.5...v1.6.6) (2025-05-10)


### Bug Fixes

* refactor translation handling and improve progress calculations ([9c81690](https://github.com/akinoccc/i18n-gettext-vscode/commit/9c8169034f38776d14a52604be87fd74e0b312f4))

## [1.6.5](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.4...v1.6.5) (2025-05-09)


### Bug Fixes

* update webview HTML setup to use localized URI ([785f598](https://github.com/akinoccc/i18n-gettext-vscode/commit/785f598e3bda53001405b8822f30ddcc9b66b564))

## [1.6.4](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.3...v1.6.4) (2025-05-09)


### Bug Fixes

* update webview panel disposal logic in EditorProvider ([af59df5](https://github.com/akinoccc/i18n-gettext-vscode/commit/af59df5a68209cd98bf85ada9e2e223fe777ce50))

## [1.6.3](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.2...v1.6.3) (2025-05-09)


### Bug Fixes

* update webview panel reference in EditorProvider ([2947bc5](https://github.com/akinoccc/i18n-gettext-vscode/commit/2947bc539e71b6e5eed0df93aa1d5350128754db))

## [1.6.2](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.1...v1.6.2) (2025-05-09)


### Bug Fixes

* update refreshEntries function to initialize PO data map ([f371694](https://github.com/akinoccc/i18n-gettext-vscode/commit/f371694b38e9c3e83b82ff953f67c9d550e784b4))

## [1.6.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.6.0...v1.6.1) (2025-05-08)


### Bug Fixes

* clean up webview resources in EditorProvider ([163a970](https://github.com/akinoccc/i18n-gettext-vscode/commit/163a970b3e511a4262ec5998939eb4c2ed854efa))

# [1.6.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.5.0...v1.6.0) (2025-05-06)


### Bug Fixes

* remove unused logger import in EditorProvider ([f44bfd4](https://github.com/akinoccc/i18n-gettext-vscode/commit/f44bfd4adad55365a4d4d2c8c1f59583ec2db375))


### Features

* enhance translation editor provider and improve loading state management ([a5487e6](https://github.com/akinoccc/i18n-gettext-vscode/commit/a5487e6aea335ba9653032bf824145c3aa570560))
* update TranslationItem component to utilize AI models ([4db162c](https://github.com/akinoccc/i18n-gettext-vscode/commit/4db162c13f51f56d73c19337478f39e417061294))

# [1.5.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.4.2...v1.5.0) (2025-05-06)


### Bug Fixes

* handle potential undefined value for l10n.uri in setupHtml function ([798844a](https://github.com/akinoccc/i18n-gettext-vscode/commit/798844a4456b1c831a24135c17fd13728cbffe9d))


### Features

* add @formkit/auto-animate dependency and integrate into TranslationProgressDialog component ([8ae47eb](https://github.com/akinoccc/i18n-gettext-vscode/commit/8ae47eb434aae6c6a2cf9a79f78b2177744df114))
* implement queue for saving PO data ([078d170](https://github.com/akinoccc/i18n-gettext-vscode/commit/078d170dea4ade3fa5005e57a91f15791d116853))

## [1.4.2](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.4.1...v1.4.2) (2025-05-06)


### Bug Fixes

* add baseURL parameter to translation model instances ([8c70b66](https://github.com/akinoccc/i18n-gettext-vscode/commit/8c70b6673cb63b30786f3f51dd25db3703434dc3))

## [1.4.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.4.0...v1.4.1) (2025-05-06)


### Bug Fixes

* incorrectly compute `hasUntranslated` flag ([1fe4d37](https://github.com/akinoccc/i18n-gettext-vscode/commit/1fe4d37522e84cc9eb9f720ae10d32ca22ca5f57))
* publish failed ([a2ff284](https://github.com/akinoccc/i18n-gettext-vscode/commit/a2ff284ddd8465911488c3c24d51be63e50f01f5))
* publish failed ([82dfac6](https://github.com/akinoccc/i18n-gettext-vscode/commit/82dfac61d51aa290e56ed25a19b608b4e17d877d))
* refine `hasUntranslated` flag computation logic ([b5d050e](https://github.com/akinoccc/i18n-gettext-vscode/commit/b5d050e746e1da1249eb84774353155ce6d215a2))

# [1.4.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.3.0...v1.4.0) (2025-05-03)


### Features

* add abort signal to AI translator for improved timeout handling ([4152299](https://github.com/akinoccc/i18n-gettext-vscode/commit/41522995fc069514ae5a948cd1332b20b6575209))

# [1.3.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.2.5...v1.3.0) (2025-05-03)


### Features

* add abort signal to AI translator for improved timeout handling ([db45f43](https://github.com/akinoccc/i18n-gettext-vscode/commit/db45f430731dc7d8fb15803dfa40b0543147da51))
* enhance translation progress dialog and localization ([5f98e5d](https://github.com/akinoccc/i18n-gettext-vscode/commit/5f98e5d160529d29b4196ef8b8884906d9f179c9))
* update color scheme to true gray for better consistency and improve tips for translation results ([967d163](https://github.com/akinoccc/i18n-gettext-vscode/commit/967d163d2c5e2f92636c65794a1cd9320d767f1e))

## [1.2.5](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.2.4...v1.2.5) (2025-05-03)


### Bug Fixes

* update translation progress handling in BatchTranslator ([aa14436](https://github.com/akinoccc/i18n-gettext-vscode/commit/aa14436faac75186a2e3c292368a225749cda141))

## [1.2.4](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.2.3...v1.2.4) (2025-05-03)


### Bug Fixes

* enhance translation handling in useTranslator and BatchTranslator ([2392b05](https://github.com/akinoccc/i18n-gettext-vscode/commit/2392b056e4ea68e7d721dcd29bb503c92f489a25))
* enhance untranslated flag logic in usePoData composable ([444eb07](https://github.com/akinoccc/i18n-gettext-vscode/commit/444eb0709a71824573670e86e895fe77cf827f55))

## [1.2.3](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.2.2...v1.2.3) (2025-05-03)


### Bug Fixes

* improve null safety across components ([0de1fa9](https://github.com/akinoccc/i18n-gettext-vscode/commit/0de1fa941a851adcff691a14c8dba66ec85f9e4c))

## [1.2.2](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.2.1...v1.2.2) (2025-05-03)


### Bug Fixes

* improve null safety and refactor TranslationEditor component ([ae6a160](https://github.com/akinoccc/i18n-gettext-vscode/commit/ae6a1606ecb50e2e622d4d90283db7972c1e7798))

## [1.2.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.2.0...v1.2.1) (2025-05-03)


### Bug Fixes

* update selectedModel initialization and improve null safety ([c27c132](https://github.com/akinoccc/i18n-gettext-vscode/commit/c27c132520dcca3c2a451368c1bf1984f881ddb6))

# [1.2.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.1.1...v1.2.0) (2025-05-03)


### Bug Fixes

* improve logging and clean up unused code ([3034bb5](https://github.com/akinoccc/i18n-gettext-vscode/commit/3034bb5f3dcc10a5a1c303584ff78fedd36d697b))
* update l10n translations ([59740e3](https://github.com/akinoccc/i18n-gettext-vscode/commit/59740e3f81f69b454ec2e6e8216c41ca7a239400))


### Features

* enhance localization support and improve l10n scripts ([66b19a5](https://github.com/akinoccc/i18n-gettext-vscode/commit/66b19a5276f765206914daf121cbd57b5d0429d3))

## [1.1.1](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.1.0...v1.1.1) (2025-05-03)


### Bug Fixes

* improve editor state persistence and restore functionality ([5639355](https://github.com/akinoccc/i18n-gettext-vscode/commit/563935551a88b36d566054312ba2b4e3680c3371))

# [1.1.0](https://github.com/akinoccc/i18n-gettext-vscode/compare/v1.0.7...v1.1.0) (2025-05-02)


### Features

* improve locale mapping ([711c02a](https://github.com/akinoccc/i18n-gettext-vscode/commit/711c02acacd2315fa86553d0d9cc522c4bedd52e))
