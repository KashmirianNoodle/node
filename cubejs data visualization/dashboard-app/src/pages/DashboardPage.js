import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChartRenderer from '../components/ChartRenderer';
import Dashboard from '../components/Dashboard';
import DashboardItem from '../components/DashboardItem';
const DashboardItems = [
  {
    id: 0,
    name: 'Total intensity, relevance, likelihood, impact by regions',
    vizState: {
      query: {
        measures: [
          'BlackData.Total_intensity',
          'BlackData.relevance',
          'BlackData.likelihood',
          'BlackData.impact',
        ],
        dimensions: ['BlackData.region'],
        order: {
          'BlackData.Total_intensity': 'desc',
        },
        segments: ['BlackData.region_empty'],
      },
      chartType: 'bar',
    },
  },
  {
    id: 1,
    name: 'Title count by pestles',
    vizState: {
      query: {
        order: {
          'BlackData.count': 'desc',
        },
        measures: ['BlackData.count'],
        dimensions: ['BlackData.pestle'],
        timeDimensions: [],
      },
      chartType: 'pie',
    },
  },
  {
    id: 2,
    name: 'Distinct topic count by regions',
    vizState: {
      query: {
        measures: ['BlackData.countDistinctTopics'],
        dimensions: ['BlackData.major_countries_by_topics'],
        order: {
          'BlackData.countDistinctTopics': 'desc',
        },
      },
      chartType: 'pie',
    },
  },
  {
    id: 3,
    name: 'Intensity, relevance, likelihood, impact by start year',
    vizState: {
      query: {
        dimensions: ['BlackData.startYear'],
        order: [['BlackData.startYear', 'asc']],
        measures: [
          'BlackData.Total_intensity',
          'BlackData.likelihood',
          'BlackData.relevance',
          'BlackData.impact',
        ],
        segments: ['BlackData.start_year_empty'],
      },
      chartType: 'line',
    },
  },
  {
    id: 4,
    name: 'Total Impact',
    vizState: {
      query: {
        measures: ['BlackData.impact'],
        order: {
          'BlackData.endYear': 'asc',
        },
      },
      chartType: 'number',
    },
  },
];

const DashboardPage = () => {
  const dashboardItem = (item) => (
    <Grid item xs={12} lg={6} key={item.id}>
      <DashboardItem title={item.name}>
        <ChartRenderer vizState={item.vizState} />
      </DashboardItem>
    </Grid>
  );

  const Empty = () => (
    <div
      style={{
        textAlign: 'center',
        padding: 12,
      }}
    >
      <Typography variant="h5" color="inherit">
        There are no charts on this dashboard. Use Playground Build to add one.
      </Typography>
    </div>
  );

  return DashboardItems.length ? (
    <Dashboard>{DashboardItems.map(dashboardItem)}</Dashboard>
  ) : (
    <Empty />
  );
};

export default DashboardPage;
