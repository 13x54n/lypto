import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Function to generate last 12 months of data
const generateLast12MonthsData = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const currentDate = new Date();
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];
    
    // Generate realistic loyalty points data (random but trending upward)
    const basePoints = 800 + (11 - i) * 50; // Base trend upward
    const variation = Math.floor(Math.random() * 200) - 100; // Random variation
    const points = Math.max(100, basePoints + variation); // Minimum 100 points
    
    data.push({
      month: monthName,
      points: points,
    });
  }
  
  return data;
};

interface ChartProps {
  width?: number;
  height?: number;
}

export function LoyaltyPointsChart({ width, height }: ChartProps) {
  const chartData = useMemo(() => generateLast12MonthsData(), []);
  
  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  const growthPercentage = previousMonth ? 
    (((currentMonth.points - previousMonth.points) / previousMonth.points) * 100).toFixed(1) : "0.0";
  
  const isTrendUp = currentMonth.points > previousMonth.points;
  const lineColor = isTrendUp ? "rgba(38, 222, 129, 1.0)" : "rgba(255, 118, 117, 1.0)";
  
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = width || screenWidth // Account for horizontal padding
  const chartHeight = height || 220;

  const data = {
    labels: chartData.map(item => item.month),
    datasets: [
        {
          data: chartData.map(item => item.points),
          color: (opacity = 1) => lineColor,
          strokeWidth: 2,
        },
    ],
  };


  const chartConfig = {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#000000',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // Gray labels
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // Hide dots
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Solid lines
      stroke: '#000000', // Gray grid lines
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loyalty Points Trend</Text>
        <Text style={styles.subtitle}>Last 12 months</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withShadow={false}
          withScrollableDot={false}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.growthContainer}>
          <Text style={styles.growthText}>
            Trending up by {growthPercentage}% this month
          </Text>
          <Text style={styles.growthIcon}>📈</Text>
        </View>
        <Text style={styles.description}>
          Showing loyalty points earned over the last 12 months.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  footer: {
    gap: 8,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  growthIcon: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    color: '#999',
  },
});
