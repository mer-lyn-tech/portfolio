/*
 ═══════════════════════════════════════════
  HOW TO ADD YOUR REAL LINKEDIN POSTS
 ═══════════════════════════════════════════
  1. Go to your LinkedIn post
  2. Right-click any post image → "Copy image address"
  3. Paste as an entry in the "images" array below
  4. Copy your post caption into "content"
  5. Copy the post URL into "url"
  6. Do NOT add certificate images — only activity/event photos
  7. Save this file — changes reflect immediately on the site
*/

const linkedinPosts = [
  {
    id: 1,
    date: "15th September 2023",
    content: "🌟 Had an incredible experience attending the Shaping Young Minds program on September 15th, 2023! It was an inspiring and interactive session with eminent personalities like Mr. Richard Rekhy (Entrepreneur, Board Member KPMG and former CEO KPMG India), Dr. Shikha Nehru Sharma (Founder, Nutriwel Health India Ltd), Maj Gen Raj Mehta, AVSM, VSM (Retd) (Former Indian Army Officer), and Ambassador Dr. Deepak Vohra, who shared invaluable insights on leadership and innovation in the industry. Grateful for the opportunity to learn from such accomplished leaders and excited to apply these insights to my academic journey and future career aspirations.",
    images: [
      "https://media.licdn.com/dms/image/v2/D5622AQF6Bzm2uP4u9w/feedshare-image-high-res/feedshare-image-high-res/0/1719299994118?e=1784764800&v=beta&t=1zL5_Mok9azcBMrrZP8Sechy9e_Hlc-QRS6zdO7YXks",
      "https://media.licdn.com/dms/image/v2/D5622AQHHNVVyAHGWew/feedshare-shrink_1280/feedshare-shrink_1280/0/1719299994816?e=1784764800&v=beta&t=_asey2N7U1vftlggMSD9LKFe8WWBmcNfT9HPk-bRLnk",
      "https://media.licdn.com/dms/image/v2/D5622AQGlUd5DXGyFyg/feedshare-shrink_1280/feedshare-shrink_1280/0/1719299993793?e=1784764800&v=beta&t=R-c1LzXK8KfZ3o4qSkOoY6dp1Qeethmr0c74Kb1AYcQ"
    ],
    likes: 20,
    url: "https://www.linkedin.com/posts/merlyn-antony-kunduparambil_shapingyoungminds-leadership-innovation-activity-7211266851970899968-cZIX"
  },
  {
    id: 2,
    date: "12th October 2023",
    content: "🌟 First-Year B.Tech Milestone 🌟 Participating in the IEDC Summit at CET Trivandrum during my first year in B.Tech was truly inspiring. The summit enriched my understanding of drone technology and GIS mapping through a hands-on workshop. Exploring innovative technologies and networking with peers and industry professionals provided valuable insights and opened doors to collaboration. This experience has significantly shaped my academic journey. Grateful for the knowledge and connections gained at the IEDC Summit and looking forward to more such opportunities.",
    images: [
      "https://media.licdn.com/dms/image/v2/D5622AQHgMXxcL6mfUw/feedshare-shrink_1280/feedshare-shrink_1280/0/1720157121597?e=1784764800&v=beta&t=WADGESPVW0hKja_KxQl30go5CT7yfilMIbV5v7B4chs"
    ],
    likes: 16,
    url: "https://www.linkedin.com/posts/merlyn-antony-kunduparambil_btechjourney-iedcsummit-innovation-activity-7214861904362491904-KfDO"
  },
  {
    id: 3,
    date: "1st March 2024",
    content: "🌟 Highlights from My First-Year B.Tech Journey 🌟 During TECHLECTICS'24, our college's tech fest, I had the privilege to participate in the DRISTHI PROJECT EXPO, where our team proudly secured the 3rd prize. Our project focused on innovative dry and wet waste segregation techniques, aiming to promote environmental sustainability. I'm sincerely grateful to our college for providing us this platform. Additionally, I was excited to take part in ICICBLH'24, where we presented our project to a distinguished panel. These experiences have been instrumental in shaping my passion for technology and sustainability.",
    images: [
      "https://media.licdn.com/dms/image/v2/D5622AQEqupu03Q9OsA/feedshare-shrink_800/feedshare-shrink_800/0/1720161437629?e=1784764800&v=beta&t=ObPmkyz9hTDdF8BGFvEaX_pq4k7rJO6GddGnBN2phGs",
      "https://media.licdn.com/dms/image/v2/D5622AQEZVdsCW--GoQ/feedshare-shrink_1280/feedshare-shrink_1280/0/1720161437939?e=1784764800&v=beta&t=yR4vguxsDZfyOnnOJqfyAxJrkQrOOPOoDr4ieXcKQEs"
    ],
    likes: 28,
    url: "https://www.linkedin.com/posts/merlyn-antony-kunduparambil_btechjourney-techlectics24-projectexpo-activity-7214880010841542656-YPMC"
  },
  {
    id: 4,
    date: "17th – 22nd July 2024",
    content: "🌟 From Learning to Leading: My AR/VR Journey with Meta Hub 🌟 From July 17th to 22nd, I had the incredible opportunity to attend a 5-day immersive Metaverse Bootcamp conducted by TECHIES, where I explored the fascinating world of AR and VR. I built a fully functional puzzle game using Unity, developed a VR portal, and gained practical industry insights. As an outcome, Meta Hub was launched at Christ College of Engineering. I am incredibly proud to share that I have been entrusted with the role of Tech Lead for Meta Hub — leading workshops, hackathons, and tech events bridging academic learning with real-world industry practices.",
    images: [
      "https://media.licdn.com/dms/image/v2/D5622AQH6orGFvJPYtQ/feedshare-image-high-res/B56ZdOKFRjGsCE-/0/1749362958188?e=1784764800&v=beta&t=lCSI6950jAymWjm6bIGU1RQPCAHMzLh_-yBFMVG-loM",
      "https://media.licdn.com/dms/image/v2/D5622AQGI8ytdxHPPEQ/feedshare-image-high-res/B56ZdOKFRkG0As-/0/1749362956277?e=1784764800&v=beta&t=7GD3afNJRjjoaI2dItb2BupaW3jUEpZtIqdsl9SW0ko",
      "https://media.licdn.com/dms/image/v2/D5622AQFm2swSgEopHA/feedshare-shrink_1280/B56ZdOKFQvHEAk-/0/1749362957590?e=1784764800&v=beta&t=mKNtSRncCCPF0cgE9FNOyQkpnlcjUzBwLNmCAvaVCn8"
    ],
    likes: 65,
    url: "https://www.linkedin.com/posts/merlyn-antony-kunduparambil_metahub-techlead-unityengine-activity-7337360062476111873-XTqB"
  },
  {
    id: 5,
    date: "2024 – 2025",
    content: "🌟 During my second year, I had the privilege of being elected as the Secretary of CODe (Community of Developers) for the academic year 2024–25 at Christ College of Engineering. I got the opportunity to organize and coordinate various events, gaining hands-on experience in leadership and teamwork. One of the highlights was being actively involved in BeachHack 25, CODe's flagship 24-hour hackathon — a truly inspiring and high-energy event that brought together creative minds from across the region. Grateful for all the learning, collaboration, and memories this role offered.",
    images: [
      "https://media.licdn.com/dms/image/v2/D4D22AQGi0TLvUF6gzw/feedshare-shrink_800/B4DZeL8Y4wHkAg-/0/1750399555283?e=1784764800&v=beta&t=ekcahpN40yOj65B7-V6FfC98yuIx_cEywqay4e5qOYM",
      "https://media.licdn.com/dms/image/v2/D4D22AQFwTV7M2t8USg/feedshare-image-high-res/B4DZeL8Y5vGUAw-/0/1750399556021?e=1784764800&v=beta&t=sD-stXWfTktyj4bwR7FAeslXMYQyGEbcC6PQD9tJtPk",
      "https://media.licdn.com/dms/image/v2/D4D22AQGudS_enPuRtw/feedshare-shrink_1280/B4DZeL8Y4ZGYAk-/0/1750399554542?e=1784764800&v=beta&t=-0_Uvw7uSNIEMtax1XzV1UBtC7vWBmGpF_MhvsMuxKM",
      "https://media.licdn.com/dms/image/v2/D4D22AQGL8sVZt3yU_g/feedshare-shrink_1280/B4DZeL8Y6GGYAo-/0/1750399557791?e=1784764800&v=beta&t=AnV1ljLFA9QrYmW65smLeMHIraxnw3cV0LQzXjhMdB8"
    ],
    likes: 47,
    url: "https://www.linkedin.com/posts/merlyn-antony-kunduparambil_code-christcollegeofengineering-beachhack25-activity-7341707876794560514-BQlb"
  },
  {
    id: 6,
    date: "24th – 25th February 2025",
    content: "🚀 Had an incredible experience participating in Takedown, the hackathon conducted at Universal Engineering College! Collaborating with my amazing teammates, we tackled challenges, brainstormed ideas, and pushed our problem-solving skills to the next level. It was a great opportunity to learn, innovate, and grow together. A huge thank you to the organizers and mentors for creating such a fantastic platform! Looking forward to more such exciting opportunities.",
    images: [
      "https://media.licdn.com/dms/image/v2/D4E22AQEkY-Q6LD9wuA/feedshare-shrink_1280/B4EZVw.k9oHMAo-/0/1741357221965?e=1784764800&v=beta&t=ASf9FgCoBm4LVQ0zs3qJa1WONLI_nJJ2EZut37Dc15g",
      "https://media.licdn.com/dms/image/v2/D4E22AQFYso68FKgvYA/feedshare-shrink_1280/B4EZVw.k9IHMAo-/0/1741357209217?e=1784764800&v=beta&t=RiB-tQbQ_mvWfu6A251_6e0YQGqF9gQ7BikCdw9SJSY"
    ],
    likes: 20,
    url: "https://www.linkedin.com/posts/sneha-nixon1_hackathon-takedown-universalengineeringcollege-ugcPost-7303781569842872320-ZTVq"
  },
  {
    id: 7,
    date: "2025",
    content: "🚀 Proud to present our Civic Reporting Management System at the Project Expo conducted by the Computer Science Department, Christ College of Engineering, Irinjalakuda! 🌍 Our web-based platform is designed to bridge the gap between citizens and local authorities, enabling transparent, efficient, and user-friendly reporting of civic issues. 🤝 Grateful for the incredible teamwork, learning, and hands-on experience throughout this journey.",
    images: [
      "https://media.licdn.com/dms/image/v2/D5622AQHG189QhHMBjQ/feedshare-image-high-res/B56ZtEkEzSHAAo-/0/1766381869951?e=1784764800&v=beta&t=4qQ4Si7b9GEi4ZiCsvxp02o97JkZYHMFhPoMPMjDJzk"
    ],
    likes: 98,
    url: "https://www.linkedin.com/posts/muhammed-afnan-889560291_projectexpo-webdevelopment-civictech-ugcPost-7408742554805936128-wgLP"
  },
  {
    id: 8,
    date: "23rd – 24th September 2025",
    content: "✨ Excited to share that our team Tech Ninjas from Christ College of Engineering participated in Hack4Edu, organized by Rajagiri College of Social Sciences and Rajagiri Business School as part of Rajagiri Conclave 2025! 🚀 We successfully cleared the first round — Idea Pitching — and got selected for the second round — Prototype Implementation. It was an amazing learning experience where we brainstormed, collaborated, and pushed our creativity to solve real-world problems. Grateful to the organizers for this wonderful platform!",
    images: [
      "https://media.licdn.com/dms/image/v2/D4E22AQEopQFth7iNkw/feedshare-image-high-res/B4EZmRL3zhIkAo-/0/1759077439138?e=1784764800&v=beta&t=2vA3paeOWx1ISsdbcqrqmLYmoRxedHTINDvPrnj5JCc",
      "https://media.licdn.com/dms/image/v2/D4E22AQEiQVc0HOYHbg/feedshare-image-high-res/B4EZmRL3zlHIAo-/0/1759077435037?e=1784764800&v=beta&t=i7Psgin7LT3qY1WZV6HEVXKYGYRi8en_mkVTKbNzZgc",
      "https://media.licdn.com/dms/image/v2/D4E22AQHZ1jSMUFD5gw/feedshare-image-high-res/B4EZmRL32dIQAo-/0/1759077439935?e=1784764800&v=beta&t=VLvjZddCf8Xl-0oKDUYukAv9vk3KzUE58_1kQvMQMsQ"
    ],
    likes: 30,
    url: "https://www.linkedin.com/posts/sneha-nixon1_hackathon-rajagiriconclave2025-hack4edu-ugcPost-7378105548258422784-STSw"
  }
];

export default linkedinPosts;
