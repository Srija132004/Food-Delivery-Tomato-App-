import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;

async function fixFoodImages() {
  try {
    await mongoose.connect(MONGO_URL);

    const db = mongoose.connection.db;
    const foods = await db.collection("foods").find({}).toArray();

    for (const food of foods) {
      if (food.image && /^food_\d+\.png$/.test(food.image)) {
        const escaped = food.image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const files = await import("node:fs/promises");
        const { readdir } = files;

        const uploads = await readdir("./uploads");
        const actualFile = uploads.find(name =>
          name.endsWith(food.image)
        );

        if (actualFile) {
          await db.collection("foods").updateOne(
            { _id: food._id },
            { $set: { image: actualFile } }
          );
          console.log(`Fixed: ${food.name} -> ${actualFile}`);
        } else {
          console.log(`Image not found: ${food.image}`);
        }
      }
    }

    console.log("Image filename update finished.");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

fixFoodImages();