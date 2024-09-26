const mongoose = require("mongoose");

Members = mongoose.model(
  "Members",
  mongoose.Schema({
    profileUrl: String,
    name: String,
    role: String,
    telegram: String,
    linkedin: String,
    github: String,
    leetcode: String, // --  --
    bannerUrl: String, // --  --
    email: String, // --  --
    description: String, // --  --
    dateAdded: String,
  })
);

module.exports = Members;

async function addMembers() {
  const memberData = [
    {
      profileUrl: "assets/images/people/abel.jpg",
      name: "Abel Dereje",
      dateAdded: "2/6/2024",
      email: "abeldereje@binarydreamers.et",
      role: "Web Developer",
      leetcode: "abiymw17",
      telegram: "https://t.me/Abela472",
      linkedin: "https://www.linkedin.com/in/abel-dereje-810816322/",
      github: "https://github.com/abela472",
      bannerUrl: "assets/images/abel-banner.png",
      description:
        "I am a web developer with a passion for creating beautiful and functional websites. I am skilled in HTML, CSS, and JavaScript, and I am always eager to learn new technologies and improve my skills. I am a team player and I enjoy collaborating with others to create innovative solutions to complex problems.",
    },
    {
      profileUrl: "assets/images/people/abraham.jpg",
      name: "Abraham Masresha",
      dateAdded: "31/5/2024",
      email: "abrsh-masresha@binarydreamers.et",
      role: "UI/UX Designer",
      leetcode: "Abrsh_M",
      telegram: "https://t.me/Eziek95",
      linkedin: "https://www.linkedin.com/in/abraham-masresha-85860229a/",
      github: "https://github.com/ablixM",
      bannerUrl: "assets/images/Abraham-banner.png",
      description:
        "I am a UI/UX designer with a passion for creating beautiful and intuitive user interfaces. I have experience working with a variety of design tools, including Adobe XD, Figma, and Sketch. I am always looking for new challenges and opportunities to grow as a designer, and I am excited to be part of the team at Habesha Developers.",
    },
    {
      profileUrl: "assets/images/people/dagi.jpg",
      name: "Dagmawi Fekadu",
      dateAdded: "2/6/2024",
      email: "dagi-F@binarydreamers.et",
      role: "Software Engineer",
      leetcode: "helutbg",
      telegram: "https://t.me/Lightweigh1",
      linkedin: "https://et.linkedin.com/in/noah-undefined-80179b322",
      github: "https://github.com/I-hates-debugging",
      bannerUrl: "assets/images/dagmawi-banner.png",
      description:
        "I am a software engineer with a passion for building high-quality software solutions. I have experience working with a variety of programming languages, including Python, Java, and C++. I am always looking for new challenges and opportunities to grow as a developer, and I am excited to be part of the team at Habesha Developers.",
    },
    {
      profileUrl: "assets/images/people/eyosi.jpg",
      name: "Eyosiyas Habtemariam",
      dateAdded: "30/5/2024",
      email: "eyosiyashabtemariam@gmail.com",
      role: "Project Manager",
      leetcode: "eyosi_y",
      telegram: "https://t.me/Wanted_person",
      linkedin: "https://www.linkedin.com/in/eyosiyas-habtemariam/",
      github: "https://github.com/theblackethiopiandude",
      bannerUrl: "assets/images/eyosias-banner.png",
      description:
        "I am a project manager with a passion for leading teams and delivering successful projects. I have experience managing projects in a variety of industries, including software development, construction, and marketing. I am skilled in project planning, scheduling, and budgeting, and I am always looking for new challenges and opportunities to grow as a project manager.",
    },
    {
      profileUrl: "assets/images/people/hamza.jpg",
      name: "Hamza Adil",
      dateAdded: "31/5/2024",
      email: "hamza@binarydreamers.et",
      role: "Software Engineer",
      leetcode: "fairvaluedev",
      telegram: "https://t.me/SolanaGMI",
      linkedin: "",
      github: "https://github.com/Hamzaadil101",
      bannerUrl: "assets/images/hamza-banner.png",
      description:
        "I am a software engineer with a passion for building high-quality software solutions. I have experience working with a variety of programming languages, including Python, Java, and C++. I am always looking for new challenges and opportunities to grow as a developer, and I am excited to be part of the team at Habesha Developers.",
    },
    {
      profileUrl: "assets/images/people/heran.jpg",
      name: "Heran Habtamu",
      dateAdded: "1/6/2024",
      email: "hheran@binarydreamers.et",
      role: "Web Developer",
      leetcode: "herann",
      telegram: "https://t.me/hheerraann",
      linkedin: "https://www.linkedin.com/in/heran-habtamu-b97a94288/",
      github: "https://github.com/hheran",
      bannerUrl: "assets/images/heran-banner.png",
      description:
        "I am a web developer with a passion for creating beautiful and functional websites. I am skilled in HTML, CSS, and JavaScript, and I am always eager to learn new technologies and improve my skills. I am a team player and I enjoy collaborating with others to create innovative solutions to complex problems.",
    },
  ];

  for (const member of memberData) await new Members(member).save();
  console.log("Members Added to MongoDB");
}
