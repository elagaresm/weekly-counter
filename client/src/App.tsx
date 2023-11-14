import { useEffect, useState } from "react";

interface Event {
  title: string;
  date: string;
  start: string;
  end: string;
}

interface Data {
  startOfWeek: string,
  endOfWeek: string,
  events: Event[]
}

// This is actually set to Wednesday 15, November 2023
const TODAY = new Date("2023-11-16T00:00:00.000Z");

function App() {
  const [data, setEvents] = useState<Data | null>(null);
  const [hourlyGoal, setHourlyGoal] = useState(100);
  const [dailyCount, setDailyCount] = useState(Number(localStorage.getItem(formatDate(TODAY))) || 0);
  const weeklyGoal = data?.events.reduce((acc: number, event: Event) => {
    const duration = calculateDuration(event.start, event.end);
    return acc + (duration * hourlyGoal);
  }, 0)
  const dailygoal = data?.events.reduce((acc: number, event: Event) => {
    // TODO: change wednesday for new Date()
    if (formatDate(event.start) === formatDate(TODAY)) {
      const duration = calculateDuration(event.start, event.end);
      return acc + (duration * hourlyGoal);
    }
    return acc;
  }, 0)

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(formatDate(TODAY), dailyCount.toString());
  }, [dailyCount])

  useEffect(() => {
    const keypressHandler = (event: KeyboardEvent) => {
      if (event.code == "Space") {
        event.preventDefault();
        setDailyCount((count) => count + 1);
      } else if (event.code === "KeyB") {
        event.preventDefault();
        setDailyCount((count) => count - 1);
      }
    }

    if (data?.events && data.events.length > 1) {
      document.addEventListener("keypress", keypressHandler);
    }
    return () => {
      document.removeEventListener("keypress", keypressHandler);
    };
  }, [data])

  return (
    <div>
      <h1>Events</h1>
      <HourlyGoal defaultValue={hourlyGoal} onChange={setHourlyGoal} />
      <p>Weekly goal: {weeklyGoal}</p>
      <p>Daily goal: {dailyCount}/{dailygoal || 0}</p>
      <ul>
        {data?.events && data?.events.length > 1 ? (
          data?.events.map((event) => {
            const duration = calculateDuration(event.start, event.end);
            return <li key={event.start}><i>({duration}h)</i> {event.title} - {formatDate(event.start)}</li>;
          })
        ) : (
          <li>No events</li>
        )}
      </ul>
    </div>
  );
}

export default App;

interface HourlyGoalProps {
  defaultValue: number;
  onChange: (value: number) => void;
}

function HourlyGoal({ defaultValue, onChange }: HourlyGoalProps) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value);
    onChange(value);
  }

  return (
    <div>
      <input onChange={handleChange} type="number" defaultValue={defaultValue} />
    </div>
  )
}

function calculateDuration(start: string, end: string) {
  const startTime = new Date(start).getHours();
  let endTime = new Date(end).getHours();

  if (endTime < startTime) {
    endTime += 24;
  }

  const duration = endTime - startTime;
  return duration;
}

function customGetDay(str: string | Date) {
  const date = typeof str == "string" ? new Date(str) : str;
  const day = date.getDay();
  if (day === 0) {
    return 6;
  }
  return day - 1;
}

function formatDate(str: string | Date) {
  const date = typeof str == "string" ? new Date(str) : str;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
