import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Journal( {month, day, challenge, color } ){
    return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.dateContainer}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>
      <Text style={styles.text}>{challenge}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingVertical: 8,
    justifyContent: 'left',
    alignItems: 'center',
    columnGap: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 129, 94, 1)',
  },
  month: {
    color: 'rgba(173, 173, 173, 1)',
    fontFamily: 'SF Compact Rounded',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  day: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'SF Compact Rounded',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  dateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  text: {
    maxWidth: "65%",
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'SF Compact Rounded',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
  },
});
