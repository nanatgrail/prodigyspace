import { AlarmManager } from "@/components/alarm-manager";
import styles from "@styles/alarms.css";

export default function AlarmsPage() {
  return (
    <div className={styles["alarms-container"]}>
      <AlarmManager />
    </div>
  );
}
