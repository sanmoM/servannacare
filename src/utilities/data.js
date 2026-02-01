import hero1 from "@/asset/homeImages/hero1.png";
import hero2 from "@/asset/homeImages/hero2.jpg";
import hero3 from "@/asset/homeImages/hero3.png";
import {
  Activity,
  Baby,
  Briefcase,
  BriefcaseMedical,
  Building2,
  Cross,
  HandHeart,
  Heart,
  HeartHandshake,
  Hospital,
  HouseHeart,
  HousePlus,
  LucideDumbbell,
  Stethoscope,
  User,
} from "lucide-react";
import agency from "@/asset/roleImages/agency.png";
import aide from "@/asset/roleImages/aide.png";
import employe from "@/asset/roleImages/employe.png";
import hospital from "@/asset/roleImages/hospital.png";
import nurse from "@/asset/roleImages/nurse.png";
import physiotherapist from "@/asset/roleImages/physiotherapist.png";
import house from "@/asset/roleImages/house.png";
import user from "@/asset/roleImages/user.png";
import caregivers from "@/asset/roleImages/caregivers.png";
export const slides = [
  {
    id: 3,
    image: hero3,
    title: "Caring Hands, Professional Hearts",
    subtitle:
      "cervanna makes it easy to find reliable, professional caregivers — whether it’s medical support or household help — so you’re never alone in the journey",
  },
  {
    id: 1,
    image: hero1,
    title: "Professional Agency Services",
    subtitle:
      "cervanna makes it easy to find reliable, professional caregivers — whether it’s medical support or household help — so you’re never alone in the journey",
  },
  {
    id: 2,
    image: hero2,
    title: "Your Health, Our Priority",
    subtitle:
      "cervanna makes it easy to find reliable, professional caregivers — whether it’s medical support or household help — so you’re never alone in the journey",
  },
];

export const services = [
  {
    id: 1,
    title: "Pre & Post Pregnancy Care",
    value: "certified-nursing-assistant",
    description:
      "Gentle, personalized support for mothers and babies before and after childbirth.",
    icon: <Baby />,
    image:
      "https://res-4.cloudinary.com/fieldfisher/image/upload/f_jpg,q_auto/v1/pimn/insights/medical-negligence/maternity-services_czxcrj",
  },
  {
    id: 2,
    title: "Post Surgery Care",
    value: "certified-nursing-assistant",
    description:
      "Professional home recovery support, including wound care, mobility assistance, and medication monitoring.",
    icon: <Cross />,
    image:
      "https://img.topchinasupplier.com/file/upload/2020/04/24/Disposable-Surgical-Powder-Powder-Free-Latex-Examination-Gloves-3.jpg",
  },
  {
    id: 3,
    title: "Elderly Care",
    value: "certified-nursing-assistant",
    description:
      "Compassionate in-home care that promotes comfort, independence, and companionship for seniors.",
    icon: <HeartHandshake />,
    image:
      "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2019/11/GettyImages-1092112802-1920x1152.jpg",
  },
  {
    id: 4,
    title: "Physiotherapy",
    value: "physiotherapist",
    description:
      "Personalized home sessions to restore mobility, relieve pain, and speed up physical recovery.",
    icon: <Activity />,
    image:
      "https://lahtaclinic.ru/wp-content/uploads/2025/01/%D1%80%D0%B5%D0%B0%D0%B1%D0%B8%D0%BB-%D0%B1%D0%BE%D0%BB.png",
  },
  {
    id: 5,
    title: "Nanny & Housekeeping",
    value: "house-manager-nanny",
    description:
      "Trusted home support — caring for your children and keeping your home in perfect balance.",
    icon: <HouseHeart />,
    image:
      "https://www.gulf-insider.com/wp-content/uploads/2024/12/STOCK-HOUSEMAID-MAID_1914b26381d_large.jpg",
  },
  {
    id: 6,
    title: "Special Needs Care",
    value: "special-need-caregiver",
    description:
      "Professional special needs caregivers in Kenya offering safe, compassionate home care for children and adults with developmental, physical, or sensory challenges.",
    icon: <HandHeart />,
    image:
      "https://nchmd.org/wp-content/uploads/2022/09/2022_06_NCHPedsPediatricSpecialNeedsNavigatorHero.jpg",
  },
  // {
  //   id: 2,
  //   title: "Nurse",
  //   description: "Lorem ipsum dolor sit amet conse ctetur adipiscing.",
  //   icon: <Stethoscope />,
  //   image:
  //     "https://www.bain.com/contentassets/ea3ac9bcf0794dceb9ccab5526d2e4e6/1440x810.jpg",
  // },
  //  {
  //   id: 3,
  //   title: "Agency",
  //   description: "Lorem ipsum dolor sit amet conse ctetur adipiscing.",
  //   icon: <Building2 />,
  //   image: "https://assets.entrepreneur.com/content/3x2/2000/1598246497-shutterstock-390454498.jpg?format=pjeg&auto=webp"
  // },

  // {
  //   id: 5,
  //   title: "Employer",
  //   description: "Lorem ipsum dolor sit amet conse ctetur adipiscing.",
  //   icon: <Briefcase />,
  //   image:"https://tint.creativemarket.com/oTo2uVcbVnS-15xQOV0DRpueMWZKCpIM2XO6pmkWg-I/width:6047/height:4035/gravity:ce/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzQ5NTYvNDk1NjYvNDk1NjY1NDIvMTQyNDc0My5qcGctby5qcGc?1712043885"
  // },

  // {
  //   id: 6,
  //   title: "Nurse Aide or Assistant",
  //   description: "Lorem ipsum dolor sit amet conse ctetur adipiscing.",
  //   icon: <User />,
  //   image:
  //     "https://infinityworks-com.s3.eu-west-2.amazonaws.com/wp-content/uploads/2020/03/healthcare-featured.jpg",
  // },

  // {
  //   id: 7,
  //   title: "Medical Institutions",
  //   description: "Lorem ipsum dolor sit amet conse ctetur adipiscing.",
  //   icon: <Hospital />,
  //   image:"https://e3.365dm.com/21/09/2048x1152/skynews-hospital-covid-19_5513559.jpg?20210915151319"
  // },
  // {
  //   id: 8,
  //   title: "Paediatrician",
  //   description: "Lorem ipsum dolor sit amet conse ctetur adipiscing.",
  //   icon: <Baby />,
  //   image:
  //     "https://synergyonline.ru/_ipx/preload_true&lazy_false/https://api.synergyonline.ru/upload/iblock/a9c/qo1xvg2n66rmgvmj3ps5zkwzvs9093bi.png",
  // },
];

export const testimonials = [
  {
    id: 1,
    name: "Lisa Thompson",
    role: "VP of Marketing",
    company: "BrandForward",
    content:
      "A game-changer for our marketing efforts. The analytics and insights provided have helped us make data-driven decisions.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLabs",
    content:
      "Outstanding support and seamless integration. The team went above and beyond to ensure our implementation was successful. Highly recommended!",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Operations Director",
    company: "Global Solutions Ltd",
    content:
      "The best investment we've made this year. The ROI was evident within the first month. Customer service is exceptional and always responsive.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "David Park",
    role: "Founder",
    company: "StartupHub",
    content:
      "Simply exceptional. The platform has scaled with our business seamlessly. We've saved thousands in operational costs while improving our service quality.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "VP of Marketing",
    company: "BrandForward",
    content:
      "A game-changer for our marketing efforts. The analytics and insights provided have helped us make data-driven decisions.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

export const blogs = [
  {
    id: 1,
    title: "The Importance of Regular Health Checkups",
    description:
      "Regular health checkups can help detect potential health issues before they become serious. Early detection gives you the best chance for receiving the right treatment quickly.",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    category: "Health",
    date: "22 SEP 2025",
    comments: [
      {
        userPhoto: "https://randomuser.me/api/portraits/women/1.jpg",
        userName: "Sophia Williams",
        comment:
          "Great reminder! I just booked my annual checkup after reading this.",
      },
      {
        userPhoto: "https://randomuser.me/api/portraits/men/2.jpg",
        userName: "David Johnson",
        comment: "Very informative. Preventive care is so underrated.",
      },
    ],
  },
  {
    id: 2,
    title: "5 Simple Tips for a Balanced Diet",
    description:
      "Maintaining a balanced diet helps keep your body strong and healthy. Here are five simple ways to improve your daily nutrition without giving up your favorite meals.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    category: "Nutrition",
    date: "22 SEP 2025",
    comments: [
      {
        userPhoto: "https://randomuser.me/api/portraits/women/3.jpg",
        userName: "Emma Brown",
        comment: "I love how easy these tips are to follow!",
      },
      {
        userPhoto: "https://randomuser.me/api/portraits/men/4.jpg",
        userName: "Michael Lee",
        comment:
          "Thanks for sharing! The portion control advice really helped me.",
      },
    ],
  },
  {
    id: 3,
    title: "How to Improve Your Sleep Naturally",
    description:
      "Struggling to get a good night’s sleep? Learn natural ways to improve your sleep quality, from setting a bedtime routine to optimizing your environment.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    category: "Wellness",
    date: "22 SEP 2025",
    comments: [
      {
        userPhoto: "https://randomuser.me/api/portraits/men/5.jpg",
        userName: "Noah Davis",
        comment:
          "This article helped me fix my sleep schedule. Highly recommend!",
      },
      {
        userPhoto: "https://randomuser.me/api/portraits/women/6.jpg",
        userName: "Olivia Martin",
        comment: "I tried the no-screen rule before bed — works wonders!",
      },
    ],
  },
  {
    id: 4,
    title: "The Power of Morning Exercise",
    description:
      "Starting your day with a quick workout boosts your energy, focus, and mood. Discover how a consistent morning routine can improve both your physical and mental health.",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    category: "Fitness",
    date: "28 SEP 2025",
    comments: [
      {
        userPhoto: "https://randomuser.me/api/portraits/men/7.jpg",
        userName: "Liam Thompson",
        comment:
          "I started jogging every morning and feel more productive at work!",
      },
      {
        userPhoto: "https://randomuser.me/api/portraits/women/8.jpg",
        userName: "Ava Johnson",
        comment: "Love this! Morning yoga changed my whole routine.",
      },
    ],
  },
  {
    id: 5,
    title: "Mindful Eating: How to Enjoy Food and Stay Healthy",
    description:
      "Mindful eating encourages awareness of what and how we eat. It helps reduce overeating, improves digestion, and builds a better relationship with food.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    category: "Nutrition",
    date: "30 SEP 2025",
    comments: [
      {
        userPhoto: "https://randomuser.me/api/portraits/women/9.jpg",
        userName: "Emily Carter",
        comment: "I've stopped eating in front of the TV — what a difference!",
      },
      {
        userPhoto: "https://randomuser.me/api/portraits/men/10.jpg",
        userName: "James Rodriguez",
        comment:
          "This helped me become more aware of portion sizes. Great tips!",
      },
    ],
  },
  {
    id: 6,
    title: "Managing Stress with Simple Breathing Techniques",
    description:
      "Breathing exercises are a powerful way to reduce stress and anxiety. Learn how to control your breath to calm your mind and improve overall well-being.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    category: "Wellness",
    date: "02 OCT 2025",
    comments: [
      {
        userPhoto: "https://randomuser.me/api/portraits/women/11.jpg",
        userName: "Sophia Lee",
        comment: "I tried box breathing during exams — it really works!",
      },
      {
        userPhoto: "https://randomuser.me/api/portraits/men/12.jpg",
        userName: "Daniel Scott",
        comment:
          "Helpful guide. I now use breathing breaks at work every hour.",
      },
    ],
  },
];

export const userRole = [
  {
    id: 1,
    text: "User",
    icon: user,
    href: "/register",
    role: "user",
  },
  {
    id: 2,
    text: "House Manager",
    icon: house,
    href: "/register",
    role: "house-manager",
  },
  {
    id: 3,
    text: "Nurse",
    icon: nurse,
    href: "/register",
    role: "nurse",
  },
  {
    id: 4,
    text: "Physiotherapist",
    icon: physiotherapist,
    href: "/register",
    role: "physiotherapist",
  },
  {
    id: 5,
    text: "Nurse Aide or Assistant",
    icon: aide,
    href: "/register",
    role: "nurse-aide-or-assistant",
  },
  {
    id: 6,
    text: "Special Need Caregivers",
    icon: caregivers,
    href: "/register",
    role: "special-need-caregivers",
  },
  {
    id: 7,
    text: "Agency",
    icon: agency,
    href: "/register",
    role: "agency",
  },

  ,
  // {
  //   id: 8,
  //   text: "Employer",
  //   icon: employe,
  //   href: "/register",
  //   role: "employer",
  // },
  {
    id: 8,
    text: "Care Institutions",
    icon: hospital,
    href: "/register",
    role: "care_institutions",
  },
];

export const languages = [
  { id: 1, value: "English", text: "English" },
  { id: 2, value: "Swahili", text: "Swahili" },
  { id: 3, value: "French", text: "French" },
  { id: 4, value: "German", text: "German" },
  { id: 5, value: "Arabic", text: "Arabic" },
  { id: 6, value: "Chinese", text: "Chinese" },
  { id: 7, value: "Other", text: "Other" },
];

export const physiotherapistServiceProvide = [
  { id: "pediatric", value: "Pediatric" },
  { id: "orthopedic", value: "Orthopedic" },
  { id: "rehab", value: "Rehab" },
  { id: "sports", value: "Sports" },
  { id: "stroke", value: "Stroke" },
];

export const educationLevels = [
  {
    id: "edu1",
    value: "Degree In Special Needs Education (SNE)",
    label: "Degree In Special Needs Education (SNE)",
  },
  {
    id: "edu2",
    value: "Degree In Early Childhood Development (ECD) with SNE units",
    label: "Degree In Early Childhood Development (ECD) with SNE units",
  },
  {
    id: "edu3",
    value: "Diploma In Special Needs Education (SNE)",
    label: "Diploma In Special Needs Education (SNE)",
  },
  {
    id: "edu4",
    value: "Diploma In Early Childhood Development (ECD) with SNE units",
    label: "Diploma In Early Childhood Development (ECD) with SNE units",
  },
];

export const fakeData = [
  {
    id: 1,
    rating: 4.5,
    name: "Milon Poddar",
    email: "john.doe@example.com",
    category: "House-Manager / Nanny",
    service: ["Live In", "Dayburg"],
    status: "available",
    education: "BSc Nursing",
    experience: 5,
    location: "New York, USA",
    photo:
      "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    rating: 4.2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    category: "Physiotherapist",
    service: ["Pediatric", "Orthopedic", "Rehab", "Sports", "Stroke"],
    status: "not available",
    education: "MSc Physiotherapy",
    experience: 7,
    location: "London, UK",
    photo:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    rating: 4.8,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    category: "House Manager / Nanny",
    service: ["Live In", "Dayburg"],
    status: "available",
    education: "Diploma in Hospitality",
    experience: 10,
    location: "Toronto, Canada",
    photo:
      "https://images.unsplash.com/photo-1672843192615-5913ef88bf17?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    rating: 3.9,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    category: "Special Need Caregiver",
    services: [
      "Autism Spectrum Disorder (ASD)",
      "Speech Therapy",
      "ADHD (Attention Deficit Hyperactivity Disorder)",
      "Cerebral Palsy",
      "Down Syndrome",
      "Blindness",
      "Dementia & Alzheimer",
    ],
    status: "available",
    education: "BA in Management",
    experience: 3,
    location: "Sydney, Australia",
    photo:
      "https://images.unsplash.com/photo-1726860768821-2b047459a33e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    rating: 4.6,
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    category: "Medical Nurse",
    status: "not available",
    education: "MBA",
    experience: 8,
    location: "Berlin, Germany",
    photo:
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    rating: 4.0,
    name: "Laura Johnson",
    email: "laura.johnson@example.com",
    category: "Certified Nursing Assistant (C.N.A)",
    service: [
      "Pre and Post Pregnancy Care",
      "Post Surgery Care",
      "Elderly Care",
    ],
    status: "available",
    education: "BSc Nursing",
    experience: 6,
    location: "Paris, France",
    photo:
      "https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    rating: 4.3,
    name: "Daniel Martinez",
    email: "daniel.martinez@example.com",
    category: "Physiotherapist",
    services: ["Pediatric", "Orthopedic", "Rehab", "Sports", "Stroke"],
    status: "available",
    education: "MSc Physiotherapy",
    experience: 4,
    location: "Madrid, Spain",
    photo:
      "https://plus.unsplash.com/premium_photo-1669703777492-561a428bfd52?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    rating: 3.8,
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    category: "House Manager / Nanny",
    service: ["Live In", "Dayburg"],
    status: "not available",
    education: "Diploma in Hospitality",
    experience: 2,
    location: "Seoul, South Korea",
    photo:
      "https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 9,
    rating: 4.7,
    name: "James Anderson",
    email: "james.anderson@example.com",
    category: "Medical Nurse",
    status: "available",
    education: "BA in Management",
    experience: 9,
    location: "Amsterdam, Netherlands",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 10,
    rating: 4.1,
    name: "Olivia Thomas",
    email: "olivia.thomas@example.com",
    category: "Certified Nursing Assistant (C.N.A)",
    service: [
      "Pre and Post Pregnancy Care",
      "Post Surgery Care",
      "Elderly Care",
    ],
    status: "available",
    education: "MBA",
    experience: 5,
    location: "Dubai, UAE",
    photo:
      "https://plus.unsplash.com/premium_photo-1669703777428-48a39ccfe8cb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const tfbEvents = [
  {
    id: 1,
    title: "Transformed for Better – Employer Edition 1 (May 2024)",
    description:
      "The Transformed for Better workshop brought together a powerful circle of mothers committed to redefining home dynamics, parenting, and the role of domestic workers. Hosted by MyHauzHelp, the event created a safe space for learning, reflection, and meaningful connection.\n The day began with a heartfelt introduction from Rahab, CEO of then MyHauzHelp, who courageously highlighted the challenges faced by domestic workers—ranging from lack of recognition to emotional burnout. She shared the vision behind Transformed for Better: to build homes grounded in empathy, dignity, and mutual respect.",

    more: [
      {
        title: "Strengthening Relationships with House Managers – Led by Kate",
        desc: "Cate guided attendees through practical tools to foster respectful and cooperative relationships with house managers. She challenged employers to lead not with authority, but with understanding—emphasizing communication, appreciation, and clarity of expectations.",
      },
      {
        title: "Child Nutrition & Wellbeing – Led by the Renowned Nthenya",
        desc: "Nutrition expert Nthenya deeply engaged the room with insights on how food shapes children’s behavior, focus, and emotional balance. She offered realistic meal tips and reminded mothers that nourishment goes beyond feeding—it’s a form of love.",
      },
      {
        title: "Parenting & Emotional Support for Mothers – Led by Grace",
        desc: "Grace delivered an emotional and healing session for mothers, focusing on self-compassion, inner strength, and creating emotionally safe homes. She helped mothers reflect on their own feelings, reminding them that a nurtured mother nurtures a home.",
      },
    ],
    title2: "Beyond Learning – Connection & Community",
    description2:
      "After the sessions, attendees enjoyed a warm meal and open networking on the scenic Nairobi Garage rooftop. Conversations flowed, stories were shared, and a sense of sisterhood was formed. Many expressed how seen and uplifted they felt—proof that Transformed for Better is more than an event; it is a movement.",
    title3: "A Vision in Motion",
    description3:
      "This workshop marked a significant step toward reshaping how families value domestic workers, nurture children, and support mothers. The journey has just begun, and the call is clear:",

    title4:
      "When homes are transformed for better, society is transformed for good.",

    sponsor: [
      "KINGDOM BANK",
      "JACARANDA MATERNITY HOPITAL",
      "SEED TO FRUIT",
      "ZUMARIDI",
    ],
    image: "https://servannacare.com/img/moja.jpg",
    date: "1 May 2024",
  },

  {
    id: 2,
    title: "Transformed for Better – House Managers Edition (Nov 2024)",
    description:
      "On 17th November 2024, the Transformed for Better – House Managers Edition gathered 35 dedicated nannies and house managers for a deeply transformative day of learning, appreciation, and empowerment. Hosted by MyHauzHelp, this event honored the silent strength of domestic workers and reaffirmed their invaluable role in homes, the economy, and society at large.",

    title2: "Opening statements",
    description2:
      "The day opened with warm introductions from the house managers, each sharing their name and story — a rare moment where they were seen and heard.Rahab, CEO of MyHauzHelp, followed with a heartfelt address, emphasizing the dignity of their work and reminding them: You don’t just support homes — you hold them together.",

    title3: "Transformative Learning Sessions",
    description3:
      "The workshop offered practical education and emotional uplift through expert-led sessions:",

    more: [
      {
        title: "First Aid Training – Jacaranda Maternity",
        desc: "Participants learned crucial emergency response skills, preparing them to act confidently and save lives when needed.",
      },
      {
        title: "Caring for Autistic Children – Dr. Alice",
        desc: "Dr. Alice empowered attendees with understanding of Autism Spectrum Disorder, sensory needs, communication approaches, and inclusive caregiving techniques.",
      },
      {
        title:
          "Financial Literacy – Elizabeth (DPAK Sacco) & Beatrice (Kingdom Bank)",
        desc: "This session equipped them with budgeting tools, savings plans, and financial confidence — reinforcing that they, too, can build a secure future.",
      },
    ],

    more2: [
      {
        title:
          "Each participant received a self-care package sponsored by Unilever ",
        desc: "A gift of appreciation for those who rarely get time to care for themselves.",
      },
      {
        title: "Certificates of Participation ",
        desc: "Were proudly awarded, celebrating their commitment to growth and professional excellence.",
      },
    ],

    title4: "Honoring the Caregivers",
    description4:
      "Following the sessions, participants enjoyed a sumptuous lunch with music, creating a joyful atmosphere of sisterhood, storytelling, and laughter. It was not just training — it was healing.",

    title5: "A Movement Beyond the Day",
    description5:
      "Transformed for Better is not just an event — it is a mission to humanize, dignify, and professionalize domestic work. This edition left every participant feeling valued, empowered, and seen.",
    title5: "“When house managers are transformed, homes are transformed.”",

    sponsor: [
      "PARTNERS",
      "KINGDOM BANK",
      "JACARANDA MATERNITY",
      "DPAK SACCO",
      "CENTRE FOR DOMESTIC TRAINING AND DEVELOPMENT (CDTD)",
      "NYARAI HOMECARE SERVICES",
      "NAIROBI NANNY",
      "NANNY MATCHfcfvg",
    ],

    image: "https://servannacare.com/img/11.jpg",
    date: "Nov 2024",
  },
];

export const categoryFilters = {
  "house manager nanny": {
    label: "House Manager / Nanny",
    options: [
      { value: "liveIn", label: "Live In" },
      { value: "dayburg", label: "Dayburg" },
    ],
  },

  physiotherapist: {
    label: "Physiotherapist",
    options: [
      { value: "pediatric", label: "Pediatric" },
      { value: "orthopedic", label: "Orthopedic" },
      { value: "rehab", label: "Rehab" },
      { value: "sports", label: "Sports" },
      { value: "stroke", label: "Stroke" },
      { value: "other", label: "Other (Describe)" },
    ],
  },

  "special needs care giver": {
    label: "Special Needs Caregiver",
    options: [
      { value: "asd", label: "Autism Spectrum Disorder (ASD)" },
      { value: "adhd", label: "ADHD" },
      { value: "cerebral", label: "Cerebral palsy" },
      { value: "down", label: "Down syndrome" },
      { value: "blindness", label: "Blindness" },
      { value: "dementia", label: "Dementia & Alzheimer" },
    ],
  },

  nurse: {
    label: "Nurse / Nurse Aide",
    options: [
      { value: "pregnancy", label: "Pre and Post Pregnancy Care" },
      { value: "postSurgery", label: "Post Surgery Care" },
      { value: "elderly", label: "Elderly Care" },
    ],
  },
};

export const serviceCategory = [
  {
    mainCategory: "House Manager / Nanny",
    value: "house-manager-nanny",
    subCategory: ["Live In", "Dayburg"],
  },
  {
    mainCategory: "Nurse",
    value: "nurse",
    subCategory: [
      "Pre and post pregnancy care",
      "Post-surgery care",
      "Palliative care",
      "Elderly care",
    ],
  },
  {
    mainCategory: "Physiotherapist",
    value: "physiotherapist",
    subCategory: ["Pediatric", "Orthopedic", "Rehab", "Sports", "Stroke"],
  },
  {
    mainCategory: "Nurse Aide or Assistant",
    value: "nurse-aide-assistant",
    subCategory: [
      "Pre and Post Pregnancy Care",
      "Post Surgery Care",
      "Elderly Care",
    ],
  },
  {
    mainCategory: "Special Need Caregiver",
    value: "special-need-caregiver",
    subCategory: [
      "Autism Spectrum Disorder (ASD)",
      "Speech Therapy",
      "ADHD (Attention Deficit Hyperactivity Disorder)",
      "Cerebral Palsy",
      "Down Syndrome",
      "Blindness",
      "Dementia & Alzheimer",
    ],
  },
];
