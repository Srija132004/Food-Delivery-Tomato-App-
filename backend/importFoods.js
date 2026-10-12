import "dotenv/config";
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

const categories = [
  ["Greek salad", 12, "Salad"],
  ["Veg salad", 18, "Salad"],
  ["Clover Salad", 16, "Salad"],
  ["Chicken Salad", 24, "Salad"],
  ["Lasagna Rolls", 14, "Rolls"],
  ["Peri Peri Rolls", 12, "Rolls"],
  ["Chicken Rolls", 20, "Rolls"],
  ["Veg Rolls", 15, "Rolls"],
  ["Ripple Ice Cream", 14, "Deserts"],
  ["Fruit Ice Cream", 22, "Deserts"],
  ["Jar Ice Cream", 10, "Deserts"],
  ["Vanilla Ice Cream", 12, "Deserts"],
  ["Chicken Sandwich", 12, "Sandwich"],
  ["Vegan Sandwich", 18, "Sandwich"],
  ["Grilled Sandwich", 16, "Sandwich"],
  ["Bread Sandwich", 24, "Sandwich"],
  ["Cup Cake", 14, "Cake"],
  ["Vegan Cake", 12, "Cake"],
  ["Butterscotch Cake", 20, "Cake"],
  ["Sliced Cake", 15, "Cake"],
  ["Garlic Mushroom", 14, "Pure Veg"],
  ["Fried Cauliflower", 22, "Pure Veg"],
  ["Mix Veg Pulao", 10, "Pure Veg"],
  ["Rice Zucchini", 12, "Pure Veg"],
  ["Cheese Pasta", 12, "Pasta"],
  ["Tomato Pasta", 18, "Pasta"],
  ["Creamy Pasta", 16, "Pasta"],
  ["Chicken Pasta", 24, "Pasta"],
  ["Buttter Noodles", 14, "Noodles"],
  ["Veg Noodles", 12, "Noodles"],
  ["Somen Noodles", 20, "Noodles"],
  ["Cooked Noodles", 15, "Noodles"],
];

const description =
  "Food provides essential nutrients for overall health and well-being";

async function importFoods() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    let added = 0;
    let skipped = 0;

    for (let i = 0; i < categories.length; i++) {
      const [name, price, category] = categories[i];
      const image = `food_${i + 1}.png`;

      const existingFood = await foodModel.findOne({
        name,
        image,
      });

      if (existingFood) {
        skipped++;
        continue;
      }

      await foodModel.create({
        name,
        description,
        price,
        category,
        image,
      });

      added++;
    }

    console.log(`Import complete. Added: ${added}, skipped: ${skipped}`);
  } catch (error) {
    console.error("Food import failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

importFoods();