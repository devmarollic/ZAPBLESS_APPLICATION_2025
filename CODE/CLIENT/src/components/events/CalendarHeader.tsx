import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import EventFilterDrawer from "./EventFilterDrawer";

interface CalendarHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onFilterChange?: (filters: any) => void;
  onViewChange?: (view: string) => void;
  onRangeChange?: (range: { from: Date; to: Date }) => void;
  totalEvents: number;
}

const CalendarHeader = ({
  selectedDate,
  onDateChange,
  onFilterChange,
  onViewChange,
  onRangeChange,
  totalEvents = 0,
}: CalendarHeaderProps) => {
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(year, 0, 1),
    to: new Date(year, 11, 31),
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    eventTypes: [],
    statuses: [],
    ministries: [],
    notificationChannels: [],
  });

  useEffect(() => {
    if (selectedDate) {
      setMonth(selectedDate.getMonth());
      setYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    console.log('Previous month clicked:', newDate);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    console.log('Next month clicked:', newDate);
    onDateChange(newDate);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDate(range);
      
      // Make sure we pass a complete object with both from and to dates
      onRangeChange?.({ 
        from: range.from, 
        to: range.to 
      });
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const formatDateRange = () => {
    if (date?.from && date?.to) {
      return `${format(date.from, "MMM d, yyyy")} - ${format(
        date.to,
        "MMM d, yyyy"
      )}`;
    }
    return "Selecione um intervalo";
  };

  const handleViewChange = (view: string) => {
    onViewChange?.(view);
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5">
            {monthNames[month].substring(0, 3).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold">{`${monthNames[month]} ${year}`}</h3>
            <span className="text-muted-foreground text-sm">
              {totalEvents} eventos
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePreviousMonth}
            >
              <span className="sr-only">Mês anterior</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "hidden md:flex justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={selectedDate}
                  selected={date}
                  onSelect={handleRangeSelect}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextMonth}
            >
              <span className="sr-only">Próximo mês</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EventFilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
    </>
  );
};

export default CalendarHeader;
