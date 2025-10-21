import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  days: boolean[];
  onChange: (days: boolean[]) => void;
}

export default function DaySelector({ days, onChange }: Props) {
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayFullNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (index: number) => {
    const newDays = [...days];
    newDays[index] = !newDays[index];
    onChange(newDays);
  };

  return (
    <View style={styles.container}>
      {dayNames.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayButton,
            days[index] && styles.dayButtonActive,
          ]}
          onPress={() => toggleDay(index)}
        >
          <Text
            style={[
              styles.dayText,
              days[index] && styles.dayTextActive,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#6A2DD4',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayTextActive: {
    color: 'white',
  },
});