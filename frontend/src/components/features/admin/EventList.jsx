import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "./EventCard";
import { formatDateTime } from "@/utils/helpers";
import { STATUS_CONFIG } from "@/const/STATUS_CONFIG";

export default function EventList({ events, onEdit, onDelete, onView }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      layout
    >
      <AnimatePresence>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            formatDate={formatDateTime}
            statusConfig={STATUS_CONFIG[event.status] || STATUS_CONFIG.UPCOMING}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
