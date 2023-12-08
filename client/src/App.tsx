import { useEffect, useState } from "react";
import {
  getDayCount,
  getWeeklyCount,
  initializeWeek,
  updateDayCount,
} from "./localStorage";
import { formatDate } from "../utils/date";

interface Event {
  title: string;
  date: string;
  start: string;
  end: string;
}

interface Data {
  startOfWeek: string;
  endOfWeek: string;
  events: Event[];
}

// This is actually set to Wednesday 15, November 2023
// "2023-11-16T00:00:00.000Z"
const TODAY = new Date();

function App() {
  const [data, setEvents] = useState<Data | null>(null);
  const [hourlyGoal, setHourlyGoal] = useState(60);
  const [dailyCount, setDailyCount] = useState(getDayCount(TODAY));
  const weeklyGoal = data?.events.reduce((acc: number, event: Event) => {
    const duration = calculateDuration(event.start, event.end);
    return acc + duration * hourlyGoal;
  }, 0);
  const [weeklyCount, setWeeklyCount] = useState(getWeeklyCount(TODAY));
  const dailyGoal = data?.events.reduce((acc: number, event: Event) => {
    // console.log("Event: ", formatDate(event.start));
    if (formatDate(event.start) == formatDate(TODAY)) {
      const duration = calculateDuration(event.start, event.end);
      return acc + duration * hourlyGoal;
    } else {
      return acc;
    }
  }, 0);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setEvents(data));

    initializeWeek(TODAY);
  }, []);

  useEffect(() => {
    updateDayCount(TODAY, dailyCount);
    setWeeklyCount(getWeeklyCount(TODAY));
  }, [dailyCount]);

  useEffect(() => {
    const keypressHandler = (event: KeyboardEvent) => {
      if (event.code == "Space") {
        event.preventDefault();
        setDailyCount((count) => count + 1);
      } else if (event.code === "KeyB") {
        event.preventDefault();
        setDailyCount((count) => count > 1 ? count - 1 : 0);
      }
    };

    if (data?.events && data.events.length > 1) {
      document.addEventListener("keypress", keypressHandler);
    }
    return () => {
      document.removeEventListener("keypress", keypressHandler);
    };
  }, [data]);

  return (
    <div>
      <h1>Events</h1>
      <HourlyGoal defaultValue={hourlyGoal} onChange={setHourlyGoal} />
      <p>
        Weekly goal: {weeklyGoal ? `${weeklyCount}/${weeklyGoal}` : "Loading..."}
      </p>
      <p>
        Daily goal: {dailyGoal ? `${dailyCount}/${dailyGoal} - ${" "}` : "Loading..."}
        {dailyGoal && <button onClick={() => setDailyCount(0)}>Reset</button>}
      </p>
      <ul>
        {data?.events && data?.events.length > 1 ? (
          data?.events.map((event) => {
            const duration = calculateDuration(event.start, event.end);
            return (
              <li key={event.start}>
                <i>({duration}h)</i> {event.title} - {formatDate(event.start)}
              </li>
            );
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
      <input
        onChange={handleChange}
        type="number"
        defaultValue={defaultValue}
      />
    </div>
  );
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
