import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart1Widget = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        
        // Hitung jumlah post per user
        const userPostCount = {};
        posts.forEach(post => {
          userPostCount[post.userId] = (userPostCount[post.userId] || 0) + 1;
        });

        const users = Object.keys(userPostCount);
        const postCounts = Object.values(userPostCount);

        setChartData({
          labels: users.map(userId => `User ${userId}`),
          datasets: [
            {
              label: 'Number of Posts',
              data: postCounts,
              backgroundColor: '#73AFC2',
              borderColor: '#5A8B9C',   
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
              hoverBackgroundColor: '#5A8B9C', 
              hoverBorderColor: '#4A7685',     
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
        display: false,
      },
      title: {
        display: false,
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
            return `Posts: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
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
          }
        },
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Posts',
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
      mode: 'index',
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Posts Distribution</h2>
      </div>
      
      <div className="h-64">
        {chartData ? (
          <Bar 
            data={chartData} 
            options={options}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
              <div className="text-gray-500 text-sm font-medium">Loading chart data...</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Users: {chartData ? chartData.labels.length : 0}</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm bg-[#73AFC2]"></div>
            <span>Posts per User</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart1Widget;