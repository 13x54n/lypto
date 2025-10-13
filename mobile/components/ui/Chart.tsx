import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '@/contexts/AuthContext';
import { endpoints } from '@/constants/api';

interface ChartProps {
  width?: number;
  height?: number;
}

interface MonthData {
  month: string;
  year: number;
  points: number;
  cumulativeLypto: number;
}

export function LoyaltyPointsChart({ width, height }: ChartProps) {
  const { userEmail } = useAuth();
  const [chartData, setChartData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [userEmail]);

  const fetchAnalytics = async () => {
    try {
      console.log('[Chart] Fetching analytics from:', `${endpoints.analyticsMonthly}?email=${userEmail}`);
      
      const response = await fetch(`${endpoints.analyticsMonthly}?email=${userEmail}`).catch(err => {
        console.error('[Chart] Fetch error:', err);
        throw err;
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Chart] Analytics data:', data);
        
        if (data.analytics && data.analytics.length > 0) {
          // User has data - show only their months
          console.log('[Chart] Showing', data.analytics.length, 'months of data');
          setChartData(data.analytics);
        } else {
          // New user - show current month with 0 points
          console.log('[Chart] New user - showing current month with 0');
          const currentDate = new Date();
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          setChartData([{
            month: monthNames[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            points: 0,
            cumulativeLypto: 0,
          }]);
        }
      } else {
        console.warn('[Chart] Response not OK:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('[Chart] Error fetching analytics:', error);
      // Show current month with 0 on error
      const currentDate = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      setChartData([{
        month: monthNames[currentDate.getMonth()],
        year: currentDate.getFullYear(),
        points: 0,
        cumulativeLypto: 0,
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Loyalty Points Trend</Text>
        </View>
        <View style={[styles.chartContainer, { height: height || 220, justifyContent: 'center' }]}>
          <ActivityIndicator size="small" color="#55efc4" />
        </View>
      </View>
    );
  }

  if (chartData.length === 0) {
    return null; // Don't show chart if no data
  }

  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  
  let growthPercentage = "0.0";
  let isTrendUp = true;
  
  if (previousMonth && previousMonth.points > 0) {
    const growth = ((currentMonth.points - previousMonth.points) / previousMonth.points) * 100;
    growthPercentage = growth.toFixed(1);
    isTrendUp = growth >= 0;
  } else if (currentMonth.points > 0) {
    isTrendUp = true;
    growthPercentage = "100.0";
  }
  
  const lineColor = isTrendUp ? "rgba(38, 222, 129, 1.0)" : "rgba(255, 118, 117, 1.0)";
  
  const screenWidth = Dimensions.get('window').width;
  // Always use full container width (dashboard has 20px padding on each side)
  const chartWidth = width || screenWidth;
  const chartHeight = height || 220;

  // Ensure we have at least 6 data points for the chart to fill width nicely
  let displayData = [...chartData];
  const minPoints = 6;
  
  if (displayData.length < minPoints) {
    // Add previous months with 0 to pad the chart
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pointsToAdd = minPoints - displayData.length;
    
    for (let i = pointsToAdd; i > 0; i--) {
      const currentDate = new Date();
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      displayData.unshift({
        month: monthNames[prevDate.getMonth()],
        year: prevDate.getFullYear(),
        points: 0,
        cumulativeLypto: 0,
      });
    }
  }

  const data = {
    labels: displayData.map(item => item.month),
    datasets: [
      {
        data: displayData.map(item => item.points),
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
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#000000',
      strokeWidth: 1,
    },
  };

  const timeRange = chartData.length === 0 ? "No data" :
                   chartData.length === 1 ? "This month" : 
                   chartData.length <= 6 ? `Last ${chartData.length} months` :
                   "Last 12 months";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loyalty Points Trend</Text>
        <Text style={styles.subtitle}>{timeRange}</Text>
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
          segments={4}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.growthContainer}>
          <Text style={styles.growthText}>
            {isTrendUp ? 'Trending up' : 'Trending down'} by {Math.abs(parseFloat(growthPercentage))}%
          </Text>
          <Text style={styles.growthIcon}>{isTrendUp ? '📈' : '📉'}</Text>
        </View>
        <Text style={styles.description}>
          Showing LYPTO points earned over the last {displayData.length} months.
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
    // paddingHorizontal: 16,
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
    alignItems: 'stretch',
    marginBottom: 16,
    width: '100%',
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
  },
  footer: {
    gap: 8,
    paddingHorizontal: 16,
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
