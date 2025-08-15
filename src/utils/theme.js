// Theme configuration
export const theme = {
  // Theme colors
  themeColor1: '#4CAF50', // Green - for buttons, highlighted text
  themeColor2: '#2196F3', // Blue - for secondary elements
  themeColor3: '#2a2a2a', // Dark gray - background color
  
  // Category colors (20 hex values)
  categoryColors: [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Light blue
    '#96CEB4', // Mint green
    '#FFEAA7', // Light yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Seafoam
    '#F7DC6F', // Yellow
    '#BB8FCE', // Lavender
    '#85C1E9', // Sky blue
    '#F8C471', // Orange
    '#82E0AA', // Light green
    '#F1948A', // Salmon
    '#85C1E9', // Light blue
    '#D7BDE2', // Light purple
    '#FAD7A0', // Peach
    '#A9DFBF', // Mint
    '#F9E79F', // Light yellow
    '#D5A6BD', // Rose
    '#A2D9CE'  // Aqua
  ]
};

// Helper function to get a random category color
export const getRandomCategoryColor = () => {
  return theme.categoryColors[Math.floor(Math.random() * theme.categoryColors.length)];
};

// Helper function to get color by index
export const getCategoryColor = (index) => {
  return theme.categoryColors[index % theme.categoryColors.length];
};
