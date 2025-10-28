// seeds.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import Post from "./models/Post.js";

dotenv.config();

const rawPosts = [
  /* Technology (3) */
  {
    categoryName: "Technology",
    title: "Five AI Tools That Will Improve Your Daily Productivity",
    content:
      "Artificial intelligence is increasingly embedded into everyday tools. This article highlights five practical AI assistants and automations that reduce repetitive tasks and free up time for creative work. We'll outline how to get started and the ethical considerations to keep in mind.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Technology",
    title: "How Edge Computing Is Reshaping Real-Time Applications",
    content:
      "Edge computing brings computation closer to users and devices, reducing latency for mission-critical apps. We explore use cases in IoT, healthcare, and live streaming and discuss adoption challenges for small and mid-sized teams.",
    image: "https://images.unsplash.com/photo-1581093588401-22afc7b0a8df?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Technology",
    title: "A Practical Guide to Securing Your Small Business Online",
    content:
      "Cybersecurity isn't only for large enterprises — small businesses are frequent targets. This guide covers affordable, high-impact practices such as multi-factor authentication, regular backups, and employee training to reduce risk.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=60",
  },

  /* Lifestyle (3) */
  {
    categoryName: "Lifestyle",
    title: "Minimalist Living: Simple Steps to Declutter Your Routine",
    content:
      "Adopting a minimalist approach can reduce stress and increase focus. Start by auditing belongings, streamlining morning routines, and limiting digital distractions — small changes that add up to a calmer daily life.",
    image: "https://images.unsplash.com/photo-1505691723518-36a1bcb0a1d3?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Lifestyle",
    title: "Building a Balanced Weekly Schedule: Work, Rest, and Joy",
    content:
      "A balanced week combines productivity with restoration and social time. We share realistic planning methods, including time-blocking and boundary-setting, that help protect long-term wellbeing.",
    image: "https://images.unsplash.com/photo-1526403224743-6d0d68b1b3b0?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Lifestyle",
    title: "Small Daily Habits That Lead to Big Changes",
    content:
      "Micro-habits compound over time. Learn how five-minute practices — journaling, brief walks, hydration rituals — can build resilience and produce measurable benefits in months, not years.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
  },

  /* Travel (3) */
  {
    categoryName: "Travel",
    title: "Sustainable Travel: How to Explore with a Smaller Footprint",
    content:
      "Travel can be transformative when done responsibly. This piece covers choosing eco-friendly accommodations, supporting local economies, and minimizing single-use waste while on the road.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Travel",
    title: "Planning a Short City Break: Tips for Maximum Enjoyment",
    content:
      "A short city break can be rewarding with tight planning: prioritize a handful of neighborhoods, reserve a great local meal, and include one relaxed activity. This article gives a simple blueprint for 48-hour itineraries.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Travel",
    title: "Hidden Gems: How to Find Authentic Local Experiences",
    content:
      "Beyond guidebook highlights lie neighborhood cafes, community markets, and lesser-known walks. We provide methods to discover authentic experiences without disrupting local life.",
    image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=800&q=60",
  },

  /* Health (3) */
  {
    categoryName: "Health",
    title: "Three Simple Changes for Better Daily Energy",
    content:
      "Energy levels respond quickly to sleep, nutrition, and movement. This article outlines three evidence-based changes — consistent sleep windows, small protein-focused breakfasts, and midday movement breaks — that often improve daytime focus.",
    image: "https://images.unsplash.com/photo-1576765607924-3dd7fdd1f3a7?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Health",
    title: "Mental Health First Steps: When and How to Seek Support",
    content:
      "Recognizing when to seek support is a key step in mental wellbeing. We cover practical first steps: speaking with a trusted person, consulting a primary care provider, and exploring brief evidence-based therapies.",
    image: "https://images.unsplash.com/photo-1558369988-8a1b8f7c7d5b?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Health",
    title: "Nutrition Basics: Building Meals That Keep You Full and Focused",
    content:
      "Balanced meals center on protein, fiber, and healthy fats. This short guide shows simple plate compositions and snack ideas that help steady blood sugar and sustain concentration throughout the day.",
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=60",
  },

  /* Finance (3) */
  {
    categoryName: "Finance",
    title: "Personal Finance 101: Building an Emergency Fund",
    content:
      "An emergency fund is foundational for resilience. Learn a step-by-step approach to automating savings, setting achievable targets, and protecting yourself from unexpected expenses.",
    image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Finance",
    title: "Investing Basics: Diversification Without the Jargon",
    content:
      "Diversification reduces risk across different asset types. This article explains simple, practical options for beginners including index funds, dollar-cost averaging, and low-cost broker choices.",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Finance",
    title: "Smart Budgeting for Freelancers and Gig Workers",
    content:
      "Irregular income requires a flexible budgeting approach. We cover how to smooth cash flow, set aside taxes, and create a realistic operating budget to avoid surprises during lean months.",
    image: "https://images.unsplash.com/photo-1559526320-3b1b5c7d91e3?auto=format&fit=crop&w=800&q=60",
  },

  /* Food (3) */
  {
    categoryName: "Food",
    title: "Simple Weeknight Meals: Healthy, Fast, and Flavorful",
    content:
      "Weeknight cooking becomes enjoyable when recipes are simple and ingredient-focused. Here are three easy templates — grain bowls, sheet-pan dinners, and stir-fries — that offer flavor without long prep.",
    image: "https://images.unsplash.com/photo-1512058564366-c9e3b3f4d3a6?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Food",
    title: "The Rise of Plant-Forward Eating: Practical Tips",
    content:
      "Plant-forward meals emphasize vegetables and whole grains while keeping meat as a complement. Learn easy swaps and a week-long plan that reduces meat without sacrificing satisfaction.",
    image: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Food",
    title: "How to Shop Smartly: Freshness, Value, and Seasonality",
    content:
      "Smart shopping balances price and quality. This guide covers how to buy seasonal produce, compare value-per-weight, and store ingredients to extend freshness and reduce waste.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=60",
  },

  /* Education (3) */
  {
    categoryName: "Education",
    title: "Lifelong Learning: How to Build a Self-Study Plan",
    content:
      "A structured self-study plan keeps learning consistent and measurable. Identify core goals, break them into weekly tasks, and use short assessments to track progress over months.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Education",
    title: "How Microcredentials Are Changing Career Growth",
    content:
      "Microcredentials and short courses let professionals reskill quickly. We examine when they make sense, how employers view them, and how to choose reputable programs.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Education",
    title: "Study Techniques That Actually Improve Retention",
    content:
      "Active recall, spaced repetition, and practice testing outperform passive review. Learn a practical study session layout that maximizes retention for busy adults and students alike.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=60",
  },

  /* Entertainment (3) */
  {
    categoryName: "Entertainment",
    title: "Streaming Smarter: How to Find Shows Worth Watching",
    content:
      "With so many streaming options, discoverability is the challenge. This article shares how to use curated lists, community recommendations, and short trials to find high-quality shows efficiently.",
    image: "https://images.unsplash.com/photo-1517604931442-69b3f9f8c3b5?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Entertainment",
    title: "The Comeback of Local Cinema and Live Events",
    content:
      "Community-focused cinema and live performances are seeing renewed interest. We explore why local experiences matter and how they add cultural depth beyond mainstream releases.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Entertainment",
    title: "Podcasts Worth Your Commute: A Curated List",
    content:
      "Podcasts offer diverse storytelling and practical insights. Here’s a curated list of shows across business, science, and personal stories to add to a commute playlist.",
    image: "https://images.unsplash.com/photo-1519885274335-7f03b9a3c3c8?auto=format&fit=crop&w=800&q=60",
  },

  /* Sports (3) */
  {
    categoryName: "Sports",
    title: "How Small Changes in Training Can Improve Performance",
    content:
      "Marginal gains often compound into measurable improvements. We look at sleep, nutrition timing, and recovery strategies that athletes at every level can adopt.",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Sports",
    title: "Community Sports Programs: Building Healthier Neighborhoods",
    content:
      "Local sports programs encourage activity and social cohesion. This article outlines how organizers can create inclusive, low-cost initiatives for children and adults.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Sports",
    title: "The Role of Technology in Athlete Development",
    content:
      "Wearables, analytics, and video review tools are democratizing high-quality coaching. Learn practical ways teams can use data without overwhelming athletes.",
    image: "https://images.unsplash.com/photo-1517964106086-29a78f586e66?auto=format&fit=crop&w=800&q=60",
  },

  /* Fashion (3) */
  {
    categoryName: "Fashion",
    title: "Building a Timeless Capsule Wardrobe on a Budget",
    content:
      "A capsule wardrobe focuses on versatile, well-fitting pieces that mix and match. This guide shows how to choose durable items and create looks that last season to season.",
    image: "https://images.unsplash.com/photo-1520975698517-1a48a86c4a09?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Fashion",
    title: "Sustainable Fabrics: What to Look For",
    content:
      "Sustainable fashion starts with materials. Learn which fabrics offer durability and a lower environmental impact, and how to interpret brand claims responsibly.",
    image: "https://images.unsplash.com/photo-1503342452485-86f7f5f9f5f7?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Fashion",
    title: "The Influence of Streetwear on Contemporary Design",
    content:
      "Streetwear has reshaped high fashion and everyday wear through collaborative drops and brand culture. We examine how grassroots aesthetics inform mainstream trends.",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09d5b?auto=format&fit=crop&w=800&q=60",
  },

  /* Politics (3) */
  {
    categoryName: "Politics",
    title: "Understanding Local Governance: How Citizens Can Get Involved",
    content:
      "Local government decisions directly affect daily life but often see low engagement. This piece offers practical steps to participate, from attending meetings to running for local office.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Politics",
    title: "The Role of Media Literacy in Healthy Democracies",
    content:
      "Media literacy equips citizens to spot misinformation and to evaluate sources fairly. Learn basic habits to improve information hygiene and civil discourse.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Politics",
    title: "Climate Policy Basics: What Citizens Should Know",
    content:
      "Climate policy involves mitigation, adaptation, and equitable transition. This primer summarizes key policy tools and how individuals can influence local climate action.",
    image: "https://images.unsplash.com/photo-1444090542259-0af8fa96557e?auto=format&fit=crop&w=800&q=60",
  },

  /* Business (3) */
  {
    categoryName: "Business",
    title: "Launching a Small Business: A Practical First-Year Checklist",
    content:
      "The first year of a small business demands attention to customers, cash flow, and simple systems. This checklist focuses on repeatable actions that improve stability and learning.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Business",
    title: "Customer Retention Strategies That Deliver Value",
    content:
      "Acquiring customers is costly; retaining them multiplies lifetime value. We cover service rituals, reasonable loyalty programs, and feedback loops that deepen relationships.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Business",
    title: "Remote Team Best Practices for Small Managers",
    content:
      "Managing remote teams requires clarity, predictable rituals, and trust. This article outlines meeting cadence, documentation habits, and cultural practices that keep distributed teams aligned.",
    image: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=800&q=60",
  },

  /* Science (3) */
  {
    categoryName: "Science",
    title: "Why Open Data Matters for Better Research",
    content:
      "Open data accelerates discovery and verification across fields. This piece explains benefits, practical platforms, and the importance of reproducible methods for trustworthy science.",
    image: "https://images.unsplash.com/photo-1559757148-5b1b6a5e1d56?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Science",
    title: "Everyday Technologies Born from Scientific Research",
    content:
      "Many conveniences stem from basic research investments — from satellite navigation to medical imaging. We highlight examples that trace practical products back to fundamental science.",
    image: "https://images.unsplash.com/photo-1581091012184-6f3b5a4d74f0?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Science",
    title: "Citizen Science: How Anyone Can Contribute to Research",
    content:
      "Citizen science projects let volunteers assist with data collection and analysis, expanding the scope of research. Learn how to find projects and contribute meaningfully.",
    image: "https://images.unsplash.com/photo-1526378723590-5f5d1d4f8f3f?auto=format&fit=crop&w=800&q=60",
  },

  /* Culture (3) */
  {
    categoryName: "Culture",
    title: "The Value of Local Storytelling in a Global Age",
    content:
      "Local stories preserve nuance and identity even as global trends spread. This article explores how community storytelling strengthens place and cultural continuity.",
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Culture",
    title: "Modern Traditions: How Communities Reinvent Rituals",
    content:
      "Traditions evolve as societies change. We look at examples where communities reframe rituals to reflect modern values while honoring heritage.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Culture",
    title: "Creative Hubs: Why Cities Invest in Arts Districts",
    content:
      "Arts districts attract tourism, talent, and investment. This piece examines the economic and social returns of nurturing creative neighborhoods.",
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=60",
  },

  /* Environment (3) */
  {
    categoryName: "Environment",
    title: "Practical Steps for Reducing Household Waste",
    content:
      "Household waste reduction begins with small habits: composting, repairing rather than replacing, and thoughtful purchasing. Here are practical steps that lower impact without major lifestyle overhaul.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Environment",
    title: "Urban Green Spaces: Benefits for Cities and Citizens",
    content:
      "Parks and green corridors improve air quality, mental health, and biodiversity. We review ways cities can expand equitable green spaces and measure their benefits.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60",
  },
  {
    categoryName: "Environment",
    title: "Renewable Energy at Home: Small Steps That Matter",
    content:
      "You don't need a full solar array to start — efficiency upgrades, smart thermostats, and community programs help reduce carbon footprints. This article explains accessible options and expected returns.",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=60",
  },
];

const run = async () => {
  try {
    await connectDB();
    const categories = await Category.find();
    if (!categories.length) {
      console.error("❌ No categories found. Run seedCategories.js first.");
      process.exit(1);
    }

    // Map category names to IDs (case-insensitive)
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name.toLowerCase()] = c._id;
    });

    // Build posts with valid category IDs; warn if missing
    const postsToInsert = [];
    for (const p of rawPosts) {
      const id = catMap[p.categoryName.toLowerCase()];
      if (!id) {
        console.warn(`⚠️ Category not found for "${p.categoryName}" — skipping post "${p.title}"`);
        continue;
      }
      postsToInsert.push({
        title: p.title,
        content: p.content,
        image: p.image,
        category: id,
        author: "Dannie",
        likes: Math.floor(Math.random() * 200),
        comments: [],
      });
    }

    if (!postsToInsert.length) {
      console.error("❌ No posts to insert. Check category names.");
      process.exit(1);
    }

    await Post.deleteMany({});
    console.log(`🧹 Deleted old posts. Inserting ${postsToInsert.length} posts...`);
    await Post.insertMany(postsToInsert);
    console.log(`✅ Successfully seeded ${postsToInsert.length} posts.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding posts:", err);
    process.exit(1);
  }
};

run();
