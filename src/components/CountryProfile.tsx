import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type CountryData = {
  flash?: boolean;
  disabled?: boolean;
  Country: string;
  //   Country_clean: string;
  //   Region: string;
  //   Happiness: number;
  //   'Average Wage (USD\/year)': number;
  //   'Infant Survival Rate': number;
  //   'Alcohol Consumption Rate': number;
  //   'Life Expectancy': number;
  //   'Netflix (USD\/month)': number;
  //   'Women Safety Index': number;
  //   'Average Winter Temperature': number;
  //   'Average Summer Temperature': number;
  //   Population: number;
  //   'Energy Per Capita': number;
  //   '% of Power from Fossil Fuels': number;
  //   '% of Power from Nuclear': number;
  //   '% of Power from Renewables': number;
  //   '% of Agricultural Land': number;
  //   '% of Forest Land': number;
  //   Territory: number;
  //   'Average Rainfall': number;
  //   Corruption: number;
  //   'Wheat Production (tonnes)': number;
  //   'Rye Production (tonnes)': number;
  //   'Potatoes Production (tonnes)': number;
  //   'Meat, chicken Production (tonnes)': number;
  //   'Avocados Production (tonnes)': number;
  //   'Petrol Price (USD\/liter)': number;
  //   'Daily Oil Consumption (Barrels)': number;
  //   'CO2 Emissions (ton per capita)': number;
};

export default function CountryProfile({
  Country,
  disabled = false,
  flash = false,
}: CountryData) {
  return (
    <Dialog>
      {disabled ? (
        <Button
          className={`w-full ${flash ? 'disabled:!text-primary disabled:!bg-primary' : 'disabled:!text-accent disabled:!bg-accent'} disabled:opacity-100`}
          type="button"
          disabled
        >
          Profile
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button
            className={`w-full ${flash ? 'text-primary' : ''}`}
            type="button"
          >
            Profile
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleCase(Country)}</DialogTitle>
          <DialogDescription>
            This is the country's profile information data. Maybe have multiple
            pages here or something.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
