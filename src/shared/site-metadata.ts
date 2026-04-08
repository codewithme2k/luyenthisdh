export const SITE_METADATA = {
  title: `Leo's dev blog – stories, insights, and ideas`,
  author: "Leo Doan",
  headerTitle: `Leo's Doan blog`,
  description:
    "A personal space on the cloud where I document my programming journey, sharing lessons, insights, and resources for fellow developers.",
  language: "en-us",
  theme: "system",
  siteUrl: "https://localhost:3000",
  siteRepo: "https://github.com/22thag6/ykhoaso",
  siteLogo: `${process.env.BASE_PATH || ""}/static/images/logo.jpg`,
  socialBanner: `${process.env.BASE_PATH || ""}/static/images/twitter-card.jpeg`,
  email: "contact@leohuynh.dev",
  github: "https://github.com/22thag6",
  x: "https://x.com/22thag6_",
  facebook: "https://facebook.com/22thag6",
  youtube: "https://www.youtube.com/@22thag6_",
  linkedin: "https://www.linkedin.com/in/22thag6",
  threads: "https://www.threads.net/22thag6_",
  instagram: "https://www.instagram.com/22thag6_",
  locale: "en-US",
  stickyNav: true,
  goodreadsBookshelfUrl:
    "https://www.goodreads.com/review/list/179720035-leo-huynh",
  goodreadsFeedUrl: "https://www.goodreads.com/review/list_rss/179720035",
  imdbRatingsList: "https://www.imdb.com/user/ur154483197/ratings/?view=grid",
  analytics: {
    umamiAnalytics: {
      websiteId: process.env.NEXT_UMAMI_ID,
      shareUrl:
        "https://analytics.leohuynh.dev/share/c9ErglxqzY5CQJ8g/leohuynh.dev",
    },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    provider: "buttondown",
  },
  comments: {
    giscusConfigs: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO!,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID!,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY!,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!,
      mapping: "title", // supported options: pathname, url, title
      reactions: "1", // Emoji reactions: 1 = enable / 0 = disable
      metadata: "0",
      theme: "light",
      darkTheme: "transparent_dark",
      themeURL: "",
      lang: "en",
    },
  },
  search: {
    kbarConfigs: {
      // path to load documents to search
      searchDocumentsPath: `${process.env.BASE_PATH || ""}/search.json`,
    },
  },
  support: {
    buyMeACoffee: "https://www.buymeacoffee.com/leohuynh.dev",
    paypal: "https://paypal.me/hta218?country.x=VN&locale.x=en_US",
    kofi: "https://ko-fi.com/hta218",
  },
};
