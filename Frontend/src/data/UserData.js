import duncanImg from "../assets/duncan.png";
import volunteer2Img from "../assets/volunteer2.png";
import volunteer3Img from "../assets/volunteer3.png";

export const volunteersDetails = [
  {
    id: 1,
    name: "Duncan Parkinson",
    img: duncanImg,
    email: "duncan@duncan.com",
    availableDates: [17, 18, 19, 24, 25, 26, 31],
    availableTimes: ["15:00", "15:30", "16:00", "16:30", "17:00"],
  },
  {
    id: 2,
    name: "Test Volunteer",
    img: volunteer2Img,
    email: "vol2@vol.com",
    availableDates: [23, 24, 27],
    availableTimes: ["14:00", "16:45", "16:30"],
  },
  {
    id: 3,
    name: "Another Volunteer",
    img: volunteer3Img,
    email: "vol3@vol.com",
    availableDates: [24, 25, 28, 30],
    availableTimes: ["10:00", "18:30"],
  },
];

export const traineeDetails = [
  {
    id: 1,
    name: "Kaska Kazimierczuk",
    img: volunteer3Img,
    email: "kaska@k.com",
  },
  {
    id: 2,
    name: "Sara Tahir",
    img: volunteer3Img,
    email: "s@email.com",
  },
  {
    id: 3,
    name: "Emiliano Uruena",
    img: volunteer2Img,
    email: "e@email.com",
  },
];
