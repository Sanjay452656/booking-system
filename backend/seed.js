/**
 * seed.js — Eventify Sample Data Seeder
 * ─────────────────────────────────────
 * Run once to populate your MongoDB with 10 sample events + images.
 *
 *   node backend/seed.js
 *
 * Safe to re-run — uses upsert (won't duplicate events).
 */

require('dotenv').config({ path: __dirname + '/.env' });

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User  = require('./src/models/user.model');
const Event = require('./src/models/event.model');

const future = (daysFromNow, hour = 18) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 0, 0, 0);
    return d;
};

// All images from Unsplash (free, no API key needed)
const EVENTS = [
    {
        title: 'Jazz Under the Stars',
        description:
            'An unforgettable evening of live jazz performed by award-winning musicians beneath an open sky. ' +
            'Featuring the acclaimed Delhi Jazz Ensemble, this outdoor concert brings together bebop, ' +
            'smooth jazz, and soul in a stunning amphitheatre setting. Blankets, picnic baskets, and good ' +
            'company welcome. Bar and gourmet food stalls on-site. Gates open one hour before showtime.',
        date: future(12, 19),
        price: 1200,
        totalSeats: 300,
        category: 'Music',
        location: 'Siri Fort Amphitheatre, New Delhi',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'React & Beyond — Frontend Summit 2025',
        description:
            'A full-day conference for frontend engineers featuring talks by React core team members, ' +
            'hands-on workshops on Next.js 15, server components, and the future of the web platform. ' +
            'Topics include performance optimization, accessibility, design systems, and AI-assisted ' +
            'coding. Lunch, coffee, and swag included. Certificate of attendance provided.',
        date: future(20, 9),
        price: 2499,
        totalSeats: 500,
        category: 'Technology',
        location: 'Bombay Exhibition Centre, Mumbai',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Mumbai City Half Marathon',
        description:
            'Join 10,000 runners for the most scenic half marathon route in India — along the Marine Drive ' +
            'promenade, through historic Colaba, and finishing at Bandra Bandstand. Open to all fitness ' +
            'levels. Timing chips, finisher medals, and energy stations every 3 km included. ' +
            'Collect your race bib from the Expo the day before. Minimum age: 16.',
        date: future(35, 6),
        price: 800,
        totalSeats: 10000,
        category: 'Sports',
        location: 'Marine Drive, Mumbai',
        image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Contemporary Art & Canvas Workshop',
        description:
            'A 3-hour immersive painting workshop led by artist Priya Menon, whose work has been exhibited ' +
            'at the Kochi Biennale and the National Gallery of Modern Art. Learn techniques in acrylic ' +
            'pouring, palette knife textures, and abstract composition. All materials provided. ' +
            'Take home your finished canvas. Suitable for all skill levels — no experience needed.',
        date: future(8, 11),
        price: 1800,
        totalSeats: 30,
        category: 'Arts',
        location: 'The Canvas Studio, Bengaluru',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Street Food Festival — Taste of India',
        description:
            'Over 60 food stalls representing 25 states of India in one sprawling outdoor festival. ' +
            'From Rajasthani Dal Baati Churma to Kolkata Kathi Rolls, Hyderabadi Biryani to Kerala Appam, ' +
            'this is the ultimate culinary journey. Live cooking demonstrations, spice masterclasses, ' +
            'and a chilli-eating competition. Entry ticket includes ₹300 food credits.',
        date: future(16, 12),
        price: 499,
        totalSeats: 2000,
        category: 'Food & Drink',
        location: 'Jawaharlal Nehru Stadium Grounds, Delhi',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Startup Pitch Night — Season 6',
        description:
            'Ten early-stage startups pitch live to a panel of venture capitalists, angel investors, ' +
            'and industry leaders. Watch business ideas compete for ₹50 lakh in seed funding. ' +
            'Open to the public — vote for your favourite startup! Networking drinks, investor Q&A ' +
            'sessions, and mentorship speed-rounds follow the main event. Bring your business cards.',
        date: future(25, 18),
        price: 0,
        totalSeats: 250,
        category: 'Business',
        location: 'NASSCOM 10,000 Startups Hub, Bengaluru',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Mindfulness & Meditation Retreat',
        description:
            'A one-day urban retreat designed to help you disconnect from digital noise and reconnect with ' +
            'yourself. Led by certified mindfulness instructor Ananya Sharma (trained at Plum Village, France). ' +
            'Sessions include guided meditation, pranayama breathing, mindful walking in nature, ' +
            'and a Sattvic vegetarian lunch. Yoga mats and cushions provided. Limited to 40 participants ' +
            'for an intimate experience.',
        date: future(14, 8),
        price: 3500,
        totalSeats: 40,
        category: 'Health',
        location: 'Nandi Hills Eco Retreat, Bengaluru',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Bollywood Dance Masterclass',
        description:
            'Learn high-energy Bollywood choreography from film choreographer Rohan Shetty, who has ' +
            'worked on blockbusters including Brahmastra and Pathaan. This 2-hour class covers ' +
            'signature Bollywood moves, expression, and a full routine to a chart-topping number. ' +
            'No dance experience required — just energy and enthusiasm! Wear comfortable clothes ' +
            'and bring water. Video recording of your performance included.',
        date: future(10, 17),
        price: 999,
        totalSeats: 80,
        category: 'Arts',
        location: 'Studio Beats, Andheri West, Mumbai',
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Python for Data Science — Bootcamp',
        description:
            'An intensive one-day bootcamp covering Python fundamentals, pandas, NumPy, Matplotlib, ' +
            'and an introduction to machine learning with scikit-learn. Hands-on projects using real ' +
            'datasets from finance and healthcare. Taught by IIT alumni with 10+ years in data science. ' +
            'Bring your laptop (Python 3.10+ required). Course material, lunch, and a 1-month mentorship ' +
            'access included. Completion certificate issued.',
        date: future(30, 9),
        price: 4999,
        totalSeats: 60,
        category: 'Education',
        location: 'IIT Bombay Innovation Cell, Mumbai',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'New Year Eve Gala 2026',
        description:
            'Ring in 2026 in spectacular style at the most glamorous New Year\'s Eve party in the city. ' +
            'Three floors of music spanning Bollywood, EDM, and retro classics — with performances by ' +
            'DJ Nucleya and special guest acts. Unlimited premium beverages, gourmet dinner buffet, ' +
            'and a midnight fireworks spectacular from the rooftop. Dress code: Black-tie / Cocktail. ' +
            'Limited VIP tables available. Advance booking strongly recommended.',
        date: future(200, 20),
        price: 8500,
        totalSeats: 600,
        category: 'Music',
        location: 'The Leela Palace Ballroom, New Delhi',
        image: 'https://images.unsplash.com/photo-1467810563316-b5af9ccbcce8?auto=format&fit=crop&w=900&q=80',
    },
];

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB…');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.\n');

        // 1. Upsert demo organizer
        const email    = 'organizer@eventify.demo';
        const password = await bcrypt.hash('Demo@1234', 10);

        let organizer = await User.findOne({ email });
        if (!organizer) {
            organizer = await User.create({ name: 'Eventify Demo', email, password, role: 'ORGANIZER' });
            console.log(`👤 Demo organizer created: ${email}`);
        } else {
            console.log(`👤 Demo organizer already exists: ${email}`);
        }

        // 2. Upsert events (insert or update by title — safe to re-run)
        let inserted = 0, updated = 0;
        for (const ev of EVENTS) {
            const result = await Event.findOneAndUpdate(
                { title: ev.title },
                { $set: { ...ev, availableSeats: ev.totalSeats, organiser: organizer._id } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            const wasNew = !result.createdAt || (Date.now() - result.createdAt.getTime() < 5000);
            if (wasNew) { inserted++; console.log(`   ✔ Inserted: ${ev.title}`); }
            else        { updated++;  console.log(`   ↺ Updated:  ${ev.title}`); }
        }

        console.log(`\n🎉 Done! ${inserted} inserted, ${updated} updated.`);
        console.log('\n📧 Demo organizer login:');
        console.log('   Email:    organizer@eventify.demo');
        console.log('   Password: Demo@1234\n');

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected.');
    }
}

seed();
