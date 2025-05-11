import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

export interface CategoryProps {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
        <Folder className="h-5 w-5" /> Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id} // Use category.id as the key
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category.id)} // Pass category.id
          >
            {category.name} 
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;