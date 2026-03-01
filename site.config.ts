import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '068ed52150234a9ea95768a33ee23fa1',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Erdem İlker',
  domain: 'www.erdemilker.com.tr',
  author: 'Erdem İlker',

  // open graph metadata (optional)
  description: 'Karanlık Hikayeler',

  // social usernames (optional)
  twitter: 'BOykuler',
  //github: 'transitive-bullshit',
  //linkedin: 'fisch2',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  navigationStyle: 'default'
  // navigationStyle: 'custom',
 navigationLinks: [
    {
      title: 'Tamamlanan Kitaplar',
      pageId: '316ddc548f41801080c9c34184ce448a'
    },
    {
      title: 'Aramizdalar Serisi',
      pageId: '316ddc548f4180c39c22c90ef9954053'
    },
    {
      title: 'Devam Eden Kitaplar',
      pageId: '316ddc548f41803da4cde760b60f9b54'
    },
    {
      title: 'Karanlik Hikayeler Seyahatnamesi',
      pageId: '316ddc548f418054aedaf59409e91fb1'
    },
    {
      title: 'Kisa - Karanlik Hikayeler',
      pageId: '316ddc548f418063835bf9df79c7a2db'
    },
    {
      title: 'Karalama Defteri - Makaleler',
      pageId: '316ddc548f41809e861ee77a1a10f096'
    }
  ]
