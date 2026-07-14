"use client";

import { useEffect, useState } from "react";
import { Check, PanelRightClose } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { StatusMark } from "@/components/dashboard/StatusMark";

type Notification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationPanelProps = {
  onClose: () => void;
  onUnreadChange?: (hasUnread: boolean) => void;
};

export function NotificationPanel({ onClose, onUnreadChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/v1/notification");
        const json = await res.json();
        if (json.code === 200 && json.data) {
          setNotifications(json.data);
        }
      } catch (e) {
        console.error("Gagal memuat notifikasi:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const hasUnread = notifications.some(n => !n.isRead);
      onUnreadChange?.(hasUnread);
    }
  }, [notifications, isLoading, onUnreadChange]);

  async function handleMarkAsRead(id: number, isRead: boolean) {
    if (isRead) return; // already read
    
    // Optimistic update
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    
    try {
      await fetch(`/api/v1/notification/${id}/read`, { method: "PATCH" });
    } catch (e) {
      console.error("Gagal menandai dibaca:", e);
      // Revert if failed
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
    }
  }

  // Group notifications
  const grouped = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt);
    let dayLabel = format(date, "d MMMM yyyy", { locale: localeId });
    if (isToday(date)) dayLabel = "Hari ini";
    else if (isYesterday(date)) dayLabel = "Kemarin";

    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <aside className="h-full w-full overflow-y-auto border-t border-[#e5e8eb] bg-white px-6 py-7 xl:min-h-[calc(100dvh-72px)] xl:w-[320px] xl:border-l xl:border-t-0">
      <div className="flex items-center gap-2.5">
        <button
          aria-label="Sembunyikan notifikasi"
          className="grid h-9 w-9 place-items-center rounded-xl border border-[#d7dce2] text-[#313841] transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-primary-300"
          onClick={onClose}
          type="button"
        >
          <PanelRightClose aria-hidden="true" size={18} strokeWidth={1.7} />
        </button>
        <h2 className="text-[16px] font-medium">Notifikasi</h2>
      </div>

      <div className="mt-8 space-y-7">
        {isLoading ? (
          <p className="text-[13px] text-[#9a9fa8] text-center">Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <p className="text-[13px] text-[#9a9fa8] text-center">Belum ada notifikasi.</p>
        ) : (
          Object.entries(grouped).map(([dayLabel, items]) => (
            <div key={dayLabel} className="space-y-7">
              <p className="text-[12px] text-[#a2a7af]">{dayLabel}</p>
              {items.map((notif) => {
                const isAf = notif.title.toLowerCase().includes("af") || notif.title.toLowerCase().includes("atrial");
                const date = new Date(notif.createdAt);
                const timeStr = format(date, "HH:mm 'WIB'");
                
                return (
                  <div
                    key={notif.id}
                    className={`stagger-item flex items-start gap-3 transition-opacity ${notif.isRead ? "opacity-60" : "opacity-100"}`}
                  >
                    <StatusMark size="small" status={isAf ? "af" : "normal"} />
                    <div className="pt-0.5 relative flex-1">
                      <p className="text-[13px] font-medium text-[#20252b]">{notif.title}</p>
                      <p className="mt-1 text-[12px] leading-[1.55] text-[#717781]">
                        {notif.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#a2a7af]">
                          Pukul {timeStr}
                        </span>
                        {!notif.isRead ? (
                          <button
                            onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                            className="flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-[10px] font-semibold text-primary-500 transition-colors hover:bg-primary-100"
                            type="button"
                          >
                            <Check size={12} strokeWidth={2.5} />
                            Tandai dibaca
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 px-1 text-[10px] font-medium text-[#9a9fa8]">
                            <Check size={12} strokeWidth={2.5} />
                            Telah dibaca
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
