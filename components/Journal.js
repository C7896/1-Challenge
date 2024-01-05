import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function Journal( {month, day, challenge} ){
    return (
    <View style={styles.root}>
      <View style={styles.calender}>
        <Text style={styles.oct}>
          {month}
        </Text>
        <Text style={styles.$20}>
          {day}
        </Text>
      </View>
      <Text style={styles.text}>
       {challenge}
      </Text>
    </View>
    )
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingTop: 13,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 13,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 28,
    columnGap: 28,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 129, 94, 1)',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  oct: {
    color: 'rgba(173, 173, 173, 1)',
    fontFamily: 'SF Compact Rounded',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  $20: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'SF Compact Rounded',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  calender: {
    paddingTop: 4,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  text: {
    width: 252,
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'SF Compact Rounded',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
  },
});
