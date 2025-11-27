import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart2Widget = () => {
  const [chartData, setChartData] = useState(null);
  const [userStats, setUserStats] = useState({ user1: 0, user2: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        
        // Filter data untuk User 1 dan User 2
        const user1Posts = posts.filter(post => post.userId === 1);
        const user2Posts = posts.filter(post => post.userId === 2);

        setUserStats({
          user1: user1Posts.length,
          user2: user2Posts.length
        });

        const createCumulativeData = (userPosts, maxPoints = 10) => {
          const data = [];
          const step = Math.ceil(userPosts.length / maxPoints);
          
          for (let i = 0; i < userPosts.length; i += step) {
            data.push({
              x: `Post ${i + 1}`,
              y: i + 1
            });
          }
          
          if (userPosts.length > 0) {
            const lastPoint = data[data.length - 1];
            if (lastPoint.y < userPosts.length) {
              data.push({
                x: `Post ${userPosts.length}`,
                y: userPosts.length
              });
            }
          }
          
          return data;
        };

        const user1Data = createCumulativeData(user1Posts);
        const user2Data = createCumulativeData(user2Posts);

        setChartData({
          datasets: [
            {
              label: 'Click to Show User 1 Posts',
              data: user1Data,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              tension: 0.2,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Click to Show User 2 Posts',
              data: user2Data,
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              tension: 0.2,
              pointBackgroundColor: 'rgb(16, 185, 129)',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} posts`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Post Progress',
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          stepSize: 5
        },
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Posts',
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Post Activity</h2>
      </div>
      
      <div className="h-64">
        {chartData ? (
          <Line 
            data={chartData} 
            options={options}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
              <div className="text-gray-500 text-sm">Loading chart data...</div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Info - Simplified */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>User 1: {userStats.user1} posts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>User 2: {userStats.user2} posts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart2Widget;