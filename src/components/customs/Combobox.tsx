"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboBoxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
}

export const ComboBox = React.forwardRef<HTMLButtonElement, ComboBoxProps>(
  ({ options, value, onChange }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref} // Gán ref vào phần tử DOM chính
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex h-10 items-center justify-between  form-styles  text-neutral-900 dark:bg-dark dark:text-gray-100 hover:bg-primary-300 dark:hover:bg-primary-200 "
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select option..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="md:w-full p-0 ">
          <Command>
            <CommandInput placeholder="Search option..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="cursor-pointer select-none rounded-md px-2 py-1 text-sm text-neutral-900 dark:text-gray-100 hover:bg-primary dark:hover:bg-primary"
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    const selectedOption = options.find(
                      (opt) => opt.label === option.label
                    );
                    if (selectedOption) {
                      onChange(selectedOption.value);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

ComboBox.displayName = "ComboBox"; // để tránh lỗi khi debug
