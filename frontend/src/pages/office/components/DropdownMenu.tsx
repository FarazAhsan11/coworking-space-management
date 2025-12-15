import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

interface Item {
  label: string;
  onClick: () => void;
}

interface Props {
  label: string;
  items: Item[];
}

export const DropdownMenu = ({ label, items }: Props) => (
  <DropdownMenuPrimitive.Root>
    <DropdownMenuPrimitive.Trigger asChild>
      <Button>{label} ▼</Button>
    </DropdownMenuPrimitive.Trigger>
    <DropdownMenuPrimitive.Content className="bg-white rounded shadow p-2 z-50">
      {items.map((item, i) => (
        <DropdownMenuPrimitive.Item
          key={i}
          className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
          onSelect={item.onClick}
        >
          {item.label}
        </DropdownMenuPrimitive.Item>
      ))}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Root>
);