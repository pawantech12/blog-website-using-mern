const initialBlogs = [
  {
    id: 1,
    title: "React Hooks Guide",
    author: "John Doe",
    publishedDate: "2023-09-20",
    category: "Tech",
    status: "Published",
  },
  {
    id: 2,
    title: "The Art of Cooking",
    author: "Jane Doe",
    publishedDate: "2023-08-15",
    category: "Food",
    status: "Draft",
  },
  {
    id: 3,
    title: "Traveling the World",
    author: "Mark Smith",
    publishedDate: "2023-07-30",
    category: "Travel",
    status: "Deleted",
  },
  {
    id: 4,
    title: "Understanding JavaScript Closures",
    author: "Alice Johnson",
    publishedDate: "2023-09-12",
    category: "Tech",
    status: "Published",
  },
  {
    id: 5,
    title: "Best Vegan Recipes",
    author: "Sophia Brown",
    publishedDate: "2023-06-25",
    category: "Food",
    status: "Published",
  },
  {
    id: 6,
    title: "Exploring Asia: A Travel Guide",
    author: "Michael Green",
    publishedDate: "2023-05-17",
    category: "Travel",
    status: "Published",
  },
  {
    id: 7,
    title: "Mastering CSS Grid",
    author: "Chris Lee",
    publishedDate: "2023-09-10",
    category: "Tech",
    status: "Draft",
  },
  {
    id: 8,
    title: "10 Quick Breakfast Recipes",
    author: "Emily White",
    publishedDate: "2023-08-02",
    category: "Food",
    status: "Published",
  },
  {
    id: 9,
    title: "Backpacking Through Europe",
    author: "David Clark",
    publishedDate: "2023-04-30",
    category: "Travel",
    status: "Published",
  },
  {
    id: 10,
    title: "A Guide to TypeScript",
    author: "Olivia Wilson",
    publishedDate: "2023-09-14",
    category: "Tech",
    status: "Deleted",
  },
  {
    id: 11,
    title: "Baking for Beginners",
    author: "Emma Thomas",
    publishedDate: "2023-07-28",
    category: "Food",
    status: "Draft",
  },
  {
    id: 12,
    title: "Top Destinations in South America",
    author: "William Harris",
    publishedDate: "2023-06-10",
    category: "Travel",
    status: "Published",
  },
  {
    id: 13,
    title: "Understanding Async/Await in JavaScript",
    author: "Lucas Robinson",
    publishedDate: "2023-09-18",
    category: "Tech",
    status: "Published",
  },
  {
    id: 14,
    title: "Healthy Meal Planning",
    author: "Ava Lewis",
    publishedDate: "2023-05-22",
    category: "Food",
    status: "Published",
  },
  {
    id: 15,
    title: "Best Road Trips in the USA",
    author: "Ethan Walker",
    publishedDate: "2023-08-07",
    category: "Travel",
    status: "Published",
  },
  {
    id: 16,
    title: "Building APIs with Node.js",
    author: "Mia Hall",
    publishedDate: "2023-09-11",
    category: "Tech",
    status: "Draft",
  },
  {
    id: 17,
    title: "Delicious Desserts for the Holidays",
    author: "Charlotte King",
    publishedDate: "2023-07-10",
    category: "Food",
    status: "Published",
  },
  {
    id: 18,
    title: "Hiking the Appalachian Trail",
    author: "Benjamin Scott",
    publishedDate: "2023-06-12",
    category: "Travel",
    status: "Deleted",
  },
  {
    id: 19,
    title: "Functional Programming in JavaScript",
    author: "Henry Adams",
    publishedDate: "2023-09-01",
    category: "Tech",
    status: "Published",
  },
  {
    id: 20,
    title: "Grilling Like a Pro",
    author: "Amelia Baker",
    publishedDate: "2023-08-23",
    category: "Food",
    status: "Draft",
  },
  {
    id: 21,
    title: "Travel Photography Tips",
    author: "Liam Collins",
    publishedDate: "2023-07-05",
    category: "Travel",
    status: "Published",
  },
  {
    id: 22,
    title: "Mastering React for Web Development",
    author: "Isabella Turner",
    publishedDate: "2023-09-08",
    category: "Tech",
    status: "Published",
  },
  {
    id: 23,
    title: "Perfect Pasta Dishes",
    author: "Jack Murphy",
    publishedDate: "2023-06-29",
    category: "Food",
    status: "Published",
  },
  {
    id: 12,
    title: "Top Destinations in South America",
    author: "William Harris",
    publishedDate: "2023-06-10",
    category: "Travel",
    status: "Published",
  },
  {
    id: 13,
    title: "Understanding Async/Await in JavaScript",
    author: "Lucas Robinson",
    publishedDate: "2023-09-18",
    category: "Tech",
    status: "Published",
  },
  {
    id: 14,
    title: "Healthy Meal Planning",
    author: "Ava Lewis",
    publishedDate: "2023-05-22",
    category: "Food",
    status: "Published",
  },
  {
    id: 15,
    title: "Best Road Trips in the USA",
    author: "Ethan Walker",
    publishedDate: "2023-08-07",
    category: "Travel",
    status: "Published",
  },
  {
    id: 16,
    title: "Building APIs with Node.js",
    author: "Mia Hall",
    publishedDate: "2023-09-11",
    category: "Tech",
    status: "Draft",
  },
  {
    id: 17,
    title: "Delicious Desserts for the Holidays",
    author: "Charlotte King",
    publishedDate: "2023-07-10",
    category: "Food",
    status: "Published",
  },
  {
    id: 18,
    title: "Hiking the Appalachian Trail",
    author: "Benjamin Scott",
    publishedDate: "2023-06-12",
    category: "Travel",
    status: "Deleted",
  },
  {
    id: 19,
    title: "Functional Programming in JavaScript",
    author: "Henry Adams",
    publishedDate: "2023-09-01",
    category: "Tech",
    status: "Published",
  },
  {
    id: 20,
    title: "Grilling Like a Pro",
    author: "Amelia Baker",
    publishedDate: "2023-08-23",
    category: "Food",
    status: "Draft",
  },
  {
    id: 21,
    title: "Travel Photography Tips",
    author: "Liam Collins",
    publishedDate: "2023-07-05",
    category: "Travel",
    status: "Published",
  },
  {
    id: 22,
    title: "Mastering React for Web Development",
    author: "Isabella Turner",
    publishedDate: "2023-09-08",
    category: "Tech",
    status: "Published",
  },
  {
    id: 23,
    title: "Perfect Pasta Dishes",
    author: "Jack Murphy",
    publishedDate: "2023-06-29",
    category: "Food",
    status: "Published",
  },
];
export default initialBlogs;
