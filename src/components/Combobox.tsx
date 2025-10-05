'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type CountryNameObject = {
  Country: string;
  Country_clean: string;
};

type Props = {
  data: CountryNameObject[];
  onSelect: (country: string) => void;
};

export function Combobox({ data, onSelect }: Props) {
  const [open, setOpen] = React.useState(false);
  const [currentCountry, setCurrentCountry] = React.useState('');

  let sortedData = data.sort((a, b) => a.Country.localeCompare(b.Country));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          {currentCountry
            ? sortedData.find((entry) => entry.Country_clean === currentCountry)
                ?.Country
            : 'Select country...'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {sortedData.map((entry) => (
                <CommandItem
                  key={entry.Country_clean}
                  value={entry.Country_clean}
                  onSelect={(val) => {
                    setCurrentCountry(val);
                    onSelect(val);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentCountry === entry.Country_clean
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {entry.Country}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
