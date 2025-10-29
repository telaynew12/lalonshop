#!/usr/bin/env node

/**
 * FIX MUSICAL INSTRUMENT IMAGES
 * This script updates all musical instrument products to use
 * the correct category avatar image instead of food/herbal images
 */

const mongoose = require('mongoose');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lalon_shop';
const MUSIC_CATEGORY_ID = '67ffd9f9e0b0849f01091e6e'; // Music instrument category
const CORRECT_IMAGE = '1744820729969_903_IMG_20250416_222517.jpg'; // Category avatar

async function fixMusicInstrumentImages() {
    try {
        console.log('🔧 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database');

        // Get the Product model
        const Product = mongoose.model('Product', new mongoose.Schema({
            title: String,
            category: String,
            media: [{
                name: String,
                path: String
            }]
        }));

        console.log('🎵 Finding products in Music instrument category...');

        // Find all products in the music instrument category
        const musicProducts = await Product.find({ category: MUSIC_CATEGORY_ID });

        console.log(`📊 Found ${musicProducts.length} products in Music instrument category`);

        // Update each product to use the correct image
        let updatedCount = 0;
        for (const product of musicProducts) {
            if (product.media && product.media.length > 0) {
                const oldImage = product.media[0].name;
                product.media[0].name = CORRECT_IMAGE;
                await product.save();
                updatedCount++;
                console.log(`✅ Updated: ${product.title}`);
                console.log(`   Old image: ${oldImage}`);
                console.log(`   New image: ${CORRECT_IMAGE}`);
            }
        }

        console.log(`\n🎉 SUCCESS: Updated ${updatedCount} products`);
        console.log('All musical instrument products now use the correct image!');

        // Verify the fix
        console.log('\n🔍 Verifying the fix...');
        const sampleProducts = await Product.find({ category: MUSIC_CATEGORY_ID }).limit(3);
        console.log('Sample updated products:');
        sampleProducts.forEach(product => {
            console.log(`• ${product.title}: ${product.media[0]?.name}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('📪 Disconnected from database');
    }
}

// Run the script
console.log('🎼 FIXING MUSICAL INSTRUMENT IMAGES');
console.log('===================================');
fixMusicInstrumentImages();
