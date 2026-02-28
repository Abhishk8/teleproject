import { useEffect, useState } from "react";
import api from "../api/api";

function Notification() {
  const workerId = 1; // simulate logged-in worker
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      const newTasks = res.data.filter(
        t => t.assigned_to === workerId && t.status === "PENDING"
      );
      setCount(newTasks.length);
    } catch (err) {
      console.error(err);
    }
  };

  if (count === 0) return null;

  return (
    <div style={styles.badge}>
      🔔 {count} New Task{count > 1 ? "s" : ""}
    </div>
  );
}

const styles = {
  badge: {
    backgroundColor: "#f59e0b",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "14px"
  }
};

export default Notification;