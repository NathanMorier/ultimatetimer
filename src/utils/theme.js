// Theme configuration
export const theme = {
  // Theme colors
  themeColor1: '#4CAF50', // Green - for buttons, highlighted text
  themeColor2: '#2196F3', // Blue - for secondary elements
  themeColor3: '#2a2a2a', // Dark gray - background color
  
  // Category colors (20 rgba values)
  categoryColors: [
    'rgba(255, 107, 107, 1)', // Red
    'rgba(78, 205, 196, 1)', // Teal
    'rgba(69, 183, 209, 1)', // Light blue
    'rgba(150, 206, 180, 1)', // Mint green
    'rgba(255, 234, 167, 1)', // Light yellow
    'rgba(221, 160, 221, 1)', // Plum
    'rgba(152, 216, 200, 1)', // Seafoam
    'rgba(247, 220, 111, 1)', // Yellow
    'rgba(187, 143, 206, 1)', // Lavender
    'rgba(133, 193, 233, 1)', // Sky blue
    'rgba(248, 196, 113, 1)', // Orange
    'rgba(130, 224, 170, 1)', // Light green
    'rgba(241, 148, 138, 1)', // Salmon
    'rgba(133, 193, 233, 1)', // Light blue
    'rgba(215, 189, 226, 1)', // Light purple
    'rgba(255, 165, 0, 1)', // Peach (more vibrant orange-peach)
    'rgba(169, 223, 191, 1)', // Mint
    'rgba(249, 231, 159, 1)', // Light yellow
    'rgba(213, 166, 189, 1)', // Rose
    'rgba(162, 217, 206, 1)'  // Aqua
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
