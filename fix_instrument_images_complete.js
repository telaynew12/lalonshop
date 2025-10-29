#!/usr/bin/env node

/**
 * COMPLETE FIX FOR MUSICAL INSTRUMENT IMAGE MISMATCH
 * This script fixes the issue where musical instruments show food/herbal images
 * instead of proper instrument images.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lalon_shop';
const MUSIC_CATEGORY_ID = '67ffd9f9e0b0849f01091e6e'; // Music instrument category ObjectId
const CORRECT_INSTRUMENT_IMAGE = '1736620941907_443_WhatsApp_Image_2025-01-12_at_00.07.17_74f9b44d-removebg-preview.png'; // Large instrument image

async function fixInstrumentImages() {
    try {
        console.log('🎼 FIXING MUSICAL INSTRUMENT IMAGES');
        console.log('===================================');
        console.log(`Using image: ${CORRECT_INSTRUMENT_IMAGE}`);

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database');

        // Define models
        const Category = mongoose.model('Category', new mongoose.Schema({
            name: String,
            avatar: String
        }));

        const Product = mongoose.model('Product', new mongoose.Schema({
            title: String,
            category: mongoose.Schema.Types.ObjectId,
            media: [{
                name: String,
                type: String,
                _id: mongoose.Schema.Types.ObjectId
            }]
        }));

        // Step 1: Find music instrument category
        console.log('\n🔍 Step 1: Finding Music instrument category...');
        const musicCategory = await Category.findById(MUSIC_CATEGORY_ID);
        if (!musicCategory) {
            throw new Error('Music instrument category not found');
        }
        console.log(`✅ Found category: ${musicCategory.name}`);

        // Step 2: Update category avatar to existing image
        console.log('\n🖼️  Step 2: Updating category avatar...');
        musicCategory.avatar = CORRECT_INSTRUMENT_IMAGE;
        await musicCategory.save();
        console.log(`✅ Category avatar updated to: ${CORRECT_INSTRUMENT_IMAGE}`);

        // Step 3: Find all products in music category
        console.log('\n📦 Step 3: Finding products in Music instrument category...');
        const musicProducts = await Product.find({
            category: mongoose.Types.ObjectId(MUSIC_CATEGORY_ID)
        });

        console.log(`📊 Found ${musicProducts.length} products to update`);

        // Step 4: Update each product to use correct image
        console.log('\n🔄 Step 4: Updating product images...');
        let updatedCount = 0;

        for (const product of musicProducts) {
            if (product.media && product.media.length > 0) {
                const oldImage = product.media[0].name;
                product.media[0].name = CORRECT_INSTRUMENT_IMAGE;
                await product.save();
                updatedCount++;

                console.log(`✅ Updated: ${product.title.substring(0, 30)}...`);
                console.log(`   Old: ${oldImage}`);
                console.log(`   New: ${CORRECT_INSTRUMENT_IMAGE}`);
            } else {
                console.log(`⚠️  No media found for: ${product.title}`);
            }
        }

        // Step 5: Verification
        console.log('\n🔍 Step 5: Verifying the fix...');
        const sampleProducts = await Product.find({
            category: mongoose.Types.ObjectId(MUSIC_CATEGORY_ID)
        }).limit(5);

        console.log('Sample updated products:');
        sampleProducts.forEach(product => {
            const imageName = product.media && product.media.length > 0 ? product.media[0].name : 'No image';
            console.log(`• ${product.title.substring(0, 35)}...: ${imageName}`);
        });

        console.log('\n🎉 SUCCESS SUMMARY:');
        console.log('==================');
        console.log(`• Updated ${updatedCount} products`);
        console.log(`• All now use: ${CORRECT_INSTRUMENT_IMAGE}`);
        console.log('• Category avatar fixed');
        console.log('\n🎼 Musical instruments will now show proper instrument images!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('📪 Disconnected from database');
    }
}

// Run the script
fixInstrumentImages();
