import { StatusMark } from "@/components/dashboard/StatusMark";

const notifications = [
  { day: "Hari ini", time: "18:05 WIB" },
  { day: "Hari ini", time: "12:45 WIB" },
  { day: "Kemarin", time: "14:06 WIB" },
];

export function NotificationPanel() {
  return (
    <aside className="border-t border-[#e5e8eb] bg-white px-5 py-6 xl:min-h-[calc(100dvh-4rem)] xl:border-l xl:border-t-0">
      <div className="flex items-center gap-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-md border border-[#cbd0d6]">
          <span className="h-3 w-px bg-[#505860]" />
        </span>
        <h2 className="text-[12px] font-medium">Notifikasi</h2>
      </div>

      <div className="mt-8 space-y-7">
        {notifications.map((notification, index) => (
          <div className="stagger-item" key={`${notification.day}-${notification.time}`}>
            {index === 0 || notifications[index - 1]?.day !== notification.day ? (
              <p className="mb-4 text-[9px] text-[#a2a7af]">{notification.day}</p>
            ) : null}
            <div className="flex items-start gap-3">
              <StatusMark size="small" status="af" />
              <div className="pt-0.5">
                <p className="text-[10px] font-medium text-[#20252b]">Terdeteksi AF</p>
                <p className="mt-1.5 text-[9px] leading-[1.5] text-[#9a9fa8]">
                  Pola Atrial Fibrilasi terdeteksi
                  <br />
                  pada pukul {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
