import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Select, MenuItem, 
  FormControl, InputLabel, Card, CardContent, Grid, CircularProgress, Skeleton 
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface WeatherData {
  id: number;
  city: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

const CITIES = ['London', 'New York', 'Tokyo', 'Mumbai', 'Sydney', 'Paris', 'Berlin'];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function WeatherDashboard() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (city: string) => {
    setLoading(true);
    setError('');
    try {
      // MOCK DATA FOR LOCAL UI TEST WITHOUT DOCKER
      await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
      
      const mockCurrent: WeatherData = {
        id: 1,
        city: city,
        temperature: parseFloat((20 + Math.random() * 10).toFixed(1)),
        humidity: Math.floor(50 + Math.random() * 30),
        timestamp: new Date().toISOString()
      };
      
      const mockHistory: WeatherData[] = Array.from({ length: 24 }).map((_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (24 - i));
        return {
          id: i,
          city: city,
          temperature: parseFloat((18 + Math.random() * 15).toFixed(1)),
          humidity: 60,
          timestamp: d.toISOString()
        };
      });

      setCurrentWeather(mockCurrent);
      setHistory(mockHistory);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCity);
  }, [selectedCity]);

  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: h.temperature
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary" align="center">
        Weather Analytics Platform
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Select City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            label="Select City"
          >
            {CITIES.map(city => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>
      )}

      <Grid container spacing={4}>
        {/* Current Weather Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="textSecondary" gutterBottom>
                Current Weather
              </Typography>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" sx={{ mx: 'auto', my: 1 }} height={60} />
                  <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} height={40} />
                </>
              ) : currentWeather ? (
                <>
                  <Typography variant="h2" component="div" fontWeight="bold">
                    {currentWeather.temperature}°C
                  </Typography>
                  <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                    Humidity: {currentWeather.humidity}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Last updated: {new Date(currentWeather.timestamp).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Temperature History (Last 24 Readings)
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="time" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip contentStyle={{ backgroundColor: '#112240', border: 'none' }} />
                  <Line type="monotone" dataKey="temp" stroke="#90caf9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                 <Typography>No history available</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
