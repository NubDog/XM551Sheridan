import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Category } from './database/database';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const CategorySelector = ({ categories, selectedId, onSelect }: CategorySelectorProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedId === category.id && styles.selectedCategory
          ]}
          onPress={() => onSelect(category.id)}
        >
          <Text style={[
            styles.categoryText,
            selectedId === category.id && styles.selectedCategoryText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#28a',
  },
  categoryText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategorySelector; 