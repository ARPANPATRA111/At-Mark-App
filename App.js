import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { initDatabase } from './services/db';
import { colors } from './theme';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (e) {
        console.error("Database initialization failed", e);
        setError(e);
      }
    };
    initialize();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.danger, marginBottom: 10 }}>Failed to initialize database.</Text>
        <Text style={{ color: colors.textSecondary, paddingHorizontal: 20 }}>{error.message}</Text>
      </View>
    );
  }

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Initializing Database...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}
