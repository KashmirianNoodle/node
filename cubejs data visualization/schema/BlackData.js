cube(`BlackData`, {
  // rewriteQueries: true,
  sql: `SELECT * FROM black.\`blackData\``,


  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },

  joins: {

  },

  segments: {
    country_empty: {
      sql: `${CUBE}.country !=''`
    },
    region_empty: {
      sql: `${CUBE}.region !=''`
    },
    pestle_empty: {
      sql: `${CUBE}.pestle !=''`
    },
    sector_empty: {
      sql: `${CUBE}.sector !=''`
    },
    topic_empty: {
      sql: `${CUBE}.topic !=''`
    },
    start_year_empty: {
      sql: `${CUBE}.start_year !=''`
    },
    end_year_empty: {
      sql: `${CUBE}.end_year !=''`
    },
    published_empty: {
      sql: `${CUBE}.published !=''`
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [country, title]
    },
    countDistinctTopics: {
      type: `countDistinct`,
      sql: `topic`
    },
    relevance: {
      sql: `relevance`,
      type: `runningTotal`,
      drillMembers: [relevance, country]
    },
    Total_intensity: {
      sql: `intensity`,
      type: `runningTotal`,
      drillMembers: [Total_intensity, country]
    },
    likelihood: {
      sql: `likelihood`,
      type: `runningTotal`,
      drillMembers: [likelihood, country]
    },
    impact: {
      sql: `impact`,
      type: `runningTotal`,
      drillMembers: [impact, title]
    },
    // source_intensity: {
    //   type: `runningTotal`,
    //   sql: ``
    // }
  },

  dimensions: {
    added: {
      sql: `added`,
      type: `string`
    },

    country: {
      sql: `country`,
      type: `string`,
      // case: {
      //   when: [
      //     { sql: `${CUBE}.country = ''`, label: `unknown` }
      //   ],
      //   else: { label: { sql: `${CUBE}.country` } },
      // }
    },

    endYear: {
      sql: `end_year`,
      type: `time`,
    },

    insight: {
      sql: `insight`,
      type: `string`
    },

    pestle: {
      // sql: `pestle`,
      type: `string`,
      case: {
        when: [
          { sql: `${CUBE}.pestle = ''`, label: `unknown` }
        ],
        else: { label: { sql: `${CUBE}.pestle` } },
      }
    },

    published: {
      sql: `published`,
      type: `time`
    },



    region: {
      type: `string`,
      sql: `region`,
      // case: {
      //   when: [
      //     { sql: `${CUBE}.region = ''`, label: `unknown` }
      //   ],
      //   else: { label: { sql: `${CUBE}.region` } },
      // }
    },

    sector: {
      sql: `sector`,
      type: `string`,
      // case: {
      //   when: [
      //     { sql: `${CUBE}.sector = ''`, label: `unknown` }
      //   ],
      //   else: { label: { sql: `${CUBE}.sector` } },
      // }
    },

    source: {
      sql: `source`,
      type: `string`
    },

    startYear: {
      sql: `start_year`,
      type: `time`,
      // case: {
      //   when: [
      //     { sql: `${CUBE}.start_year = ''`, label: `unknown` }
      //   ],
      //   else: { label: { sql: `${CUBE}.start_year` } },
      // }
    },

    title: {
      sql: `title`,
      type: `string`
    },

    topic: {
      sql: `topic`,
      type: `string`,
      // case: {
      //   when: [
      //     { sql: `${CUBE}.topic = ''`, label: `unknown` }
      //   ],
      //   else: { label: { sql: `${CUBE}.topic` } },
      // }
    },

    url: {
      sql: `url`,
      type: `string`,
      format: `link`
    },

    major_countries_by_topics: {
      type: `string`,
      case: {
        when: [
          { sql: `${CUBE}.country = 'Russia'`, label: { sql: `${CUBE}.country` } },
          { sql: `${CUBE}.country = 'United States of America'`, label: { sql: `${CUBE}.country` } },
          { sql: `${CUBE}.country = 'India'`, label: { sql: `${CUBE}.country` } },
          { sql: `${CUBE}.country = 'Iran'`, label: { sql: `${CUBE}.country` } },
          { sql: `${CUBE}.country = 'China'`, label: { sql: `${CUBE}.country` } }

        ],
        else: { label: `others with count < 9` },
      }
    }
  },


  dataSource: `default`
});

