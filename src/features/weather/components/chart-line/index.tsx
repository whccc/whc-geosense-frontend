import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { hour: "6am", temp: 20 },
  { hour: "9am", temp: 22 },
  { hour: "12pm", temp: 25 },
  { hour: "3pm", temp: 27 },
  { hour: "6pm", temp: 24 },
];

const ChartLine = () => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data}>
      <XAxis dataKey="hour" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="temp" stroke="#ff7300" />

    </LineChart>
    
  </ResponsiveContainer>
);

export default ChartLine;
