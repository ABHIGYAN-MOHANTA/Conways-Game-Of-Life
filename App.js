import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Dimensions, Animated } from "react-native";

const numRows = 30;
const numCols = 20; // Adjust the number of columns for a rectangular layout
const cellSize = Math.floor(Dimensions.get("window").width / numCols);

const initializeGrid = () => {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    grid.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return grid;
};

export default function App() {
  const [grid, setGrid] = useState(() => initializeGrid());
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setGrid((prevGrid) => computeNextGen(prevGrid));
    }, 200);

    return () => {
      clearInterval(interval);
      opacity.setValue(0);
    };
  }, []);

  const computeNextGen = (grid) => {
    const newGrid = [];
    for (let i = 0; i < numRows; i++) {
      const newRow = [];
      for (let j = 0; j < numCols; j++) {
        const neighbors = [
          [i - 1, j - 1],
          [i - 1, j],
          [i - 1, j + 1],
          [i, j - 1],
          [i, j + 1],
          [i + 1, j - 1],
          [i + 1, j],
          [i + 1, j + 1],
        ];
        const liveNeighbors = neighbors.reduce((acc, [x, y]) => {
          if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
            acc += grid[x][y];
          }
          return acc;
        }, 0);
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          newRow.push(0);
        } else if (grid[i][j] === 0 && liveNeighbors === 3) {
          newRow.push(1);
        } else {
          newRow.push(grid[i][j]);
        }
      }
      newGrid.push(newRow);
    }
    return newGrid;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Conway's Game of Life</Text>
      <Text style={styles.header}>inspired by Primeagean</Text>
      <Animated.View style={{ opacity, flex: 1 }}>
        <View style={{ flex: numRows, flexDirection: "column" }}>
          {grid.map((row, i) => (
            <View key={i} style={{ flexDirection: "row" }}>
              {row.map((cell, j) => (
                <View
                  key={j}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell ? "#4CAF50" : "#000",
                    borderWidth: 1,
                    borderColor: "#444",
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  header: {
    backgroundColor: "#4CAF50",
    textAlign: "center",
    fontVariant: "bold",
    color: "#000000",
    paddingBottom: 20,
    marginBottom: 20,
  },
  title: {
    backgroundColor: "#4CAF50",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#181D31",
    paddingTop: 30,
  },
});
