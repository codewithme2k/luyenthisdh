export const SITE_METADATA = {
  title: `HuuDoan – stories, insights, and ideas`,
  author: "Huu Doan",
  headerTitle: `HuuDoan's blog`,
  description:
    "Không gian số của Bác sĩ Hữu – nơi ghi lại hành trình chinh phục lập trình, chia sẻ kiến thức về Web Development và các công cụ hỗ trợ y khoa lâm sàng cho cộng đồng.",
  language: "en-us",
  theme: "system",
  siteUrl: "https://localhost:3000",
  siteRepo: "https://github.com/22thag6/luyenthisdh",
  siteLogo: `${process.env.BASE_PATH || ""}/static/images/logo.jpg`,
  socialBanner: `${process.env.BASE_PATH || ""}/static/images/twitter-card.jpeg`,
  email: "22thag6@gmail.com",
  github: "https://github.com/22thag6",
  x: "https://x.com/22thag6_",
  facebook: "https://facebook.com/huu.bibo.3",
  youtube: "https://www.youtube.com/@22thag6",
  linkedin: "https://www.linkedin.com/in/22thag6",
  threads: "https://www.threads.net/22thag6",
  instagram: "https://www.instagram.com/_22thag6",
  locale: "en-US",
  stickyNav: true,
  goodreadsBookshelfUrl: "#",
  goodreadsFeedUrl: "#",
  imdbRatingsList: "#",
  analytics: {
    umamiAnalytics: {
      websiteId: process.env.NEXT_UMAMI_ID,
      shareUrl: "#",
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
