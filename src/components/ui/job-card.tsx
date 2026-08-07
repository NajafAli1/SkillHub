import Link from "next/link";
import { Badge } from "./badge";

export interface JobCardProps {
  id: string;
  companyName: string;
  companyLogo?: string;
  isVerified?: boolean;
  title: string;
  budget: string;
  locationType: "Remote" | "Onsite" | "Hybrid";
  skills: string[];
  postedAt: string;
}

export function JobCard({
  id,
  companyName,
  isVerified = true,
  title,
  budget,
  locationType,
  skills,
  postedAt,
}: JobCardProps) {
  return (
    <div className="bg-white border border-[#e3e8de] rounded-[12px] p-6 hover:border-[#1c7c54] transition-all flex flex-col justify-between">
      <div>
        {/* Header Klien & Verifikasi */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#73e2a7]/30 text-[#00623f] flex items-center justify-center font-bold text-sm">
              {companyName.charAt(0)}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">
                {companyName}
              </span>
              {isVerified && (
                <svg
                  className="w-4 h-4 text-[#1c7c54]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-500">{postedAt}</span>
        </div>

        {/* Judul & Budget */}
        <Link href={`/jobs/${id}`} className="group">
          <h3 className="text-lg font-bold text-[#161e11] group-hover:text-[#1c7c54] transition-colors mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-[#1c7c54] font-bold text-base mb-4">{budget}</p>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.map((skill) => (
            <Badge key={skill} variant="pale">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[#e3e8de]/60 flex items-center justify-between">
        <Badge variant="outline">{locationType}</Badge>
        <Link
          href={`/jobs/${id}`}
          className="text-xs font-semibold text-[#1c7c54] hover:underline"
        >
          Lihat Detail &rarr;
        </Link>
      </div>
    </div>
  );
}
