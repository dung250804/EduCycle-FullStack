import type { Post, ItemType, Fundraiser, FundraiserType } from "@/types/user";
import { FundraiserCardProps } from "@/components/FundraiserCard";

export const categories = [
  { id: "c1", name: 'Textbooks' },
  { id: "c2", name: 'Electronics' },
  { id: "c3", name: 'School Supplies' },
  { id: "c4", name: 'Sports Equipment' },
  { id: "c5", name: 'Musical Instruments' },
  { id: "c6", name: 'Uniforms' },
  { id: "c7", name: 'Lab Equipment' },
];


export const mockFundraisers: Fundraiser[] = [
  {
    id: "1",
    title: "Band Trip to State Competition",
    description: "Help our award-winning band travel to the state competition this spring. Funds will cover transportation, lodging, and meals for 45 students.",
    goalAmount: 5000,
    amountRaised: 3250,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    organizer: "Music Department",
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days from now
    participants: 42,
    fundraiserType: "ItemSale",
    items: [
      {
        post_id: "f1-item1",
        seller_id: "seller1",
        title: "Band Concert Ticket",
        description: "Ticket to the band's fundraising concert on May 15th.",
        price: 25,
        type: "Liquidation",
        product_type: "Event Ticket",
        status: "Approved",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
      },
      {
        post_id: "f1-item2",
        seller_id: "seller1",
        title: "Band T-Shirt",
        description: "Support the band with this commemorative t-shirt.",
        price: 20,
        type: "Liquidation",
        product_type: "Apparel",
        status: "Approved",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
      }
    ]
  },
  {
    id: "2",
    title: "New Science Lab Equipment",
    description: "Our science department needs updated microscopes and lab materials to enhance student learning experiences.",
    goalAmount: 3500,
    amountRaised: 1200,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    organizer: "Science Department",
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
    participants: 18,
    fundraiserType: "ItemDonation",
    items: []
  },
  {
    id: "3",
    title: "School Library Book Drive",
    description: "Help us add 200 new books to our school library. Your donations will directly fund new literature for students of all ages.",
    goalAmount: 2000,
    amountRaised: 1850,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    organizer: "Library Club",
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 days from now
    participants: 35,
    fundraiserType: "ItemDonation",
    items: []
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
}

export const currentUser: User = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@school.edu",
  role: "student",
  avatar: "https://i.pravatar.cc/150?u=alex"
};
