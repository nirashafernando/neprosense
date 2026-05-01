import React from "react";
import { FileText, Edit3, AlertCircle } from "lucide-react";

/**
 * FieldSourceBadge — inline pill badge showing how a form field got its value.
 *
 * Props:
 *   source: "lab_report" | "manual" | "not_found" | null
 *
 * Renders nothing when source is null (field hasn't been touched by extraction).
 */
const BADGE_CONFIG = {
  lab_report: {
    label: "From Lab Report",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: FileText,
  },
  not_found: {
    label: "Not Found in Report",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: AlertCircle,
  },
  manual: {
    label: "Entered Manually",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    Icon: Edit3,
  },
};

const FieldSourceBadge = ({ source }) => {
  if (!source || !BADGE_CONFIG[source]) return null;

  const { label, className, Icon } = BADGE_CONFIG[source];

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ml-2 whitespace-nowrap ${className}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
};

export default FieldSourceBadge;
