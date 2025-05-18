import api from './api';

// Description: Analyze a tweet for fake news detection using GNN-FakeNews
// Endpoint: POST /api/tweets/analyze
// Request: { text: string }
// Response: {
//   isFakeNews: boolean,
//   confidenceScore: number,
//   timestamp: string,
//   id: string
// }
export const analyzeTweet = async (data: { text: string }) => {
  try {
    const response = await api.post('/api/tweets/analyze', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get history of analyzed tweets
// Endpoint: GET /api/tweets/history
// Request: {}
// Response: {
//   tweets: Array<{
//     id: string,
//     text: string,
//     isFakeNews: boolean,
//     confidenceScore: number,
//     timestamp: string
//   }>
// }
export const getTweetHistory = async () => {
  try {
    const response = await api.get('/api/tweets/history');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};